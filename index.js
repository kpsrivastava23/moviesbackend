const express = require("express");
const app = express();
const cors = require('cors');
const axios = require('axios');

const connectt = require('./database/connection')
const Profile = require('./database/Profile')
const Wishlist = require('./database/Wishlist')
const Lists = require('./database/Lists')
const UserLists = require('./database/UserLists')
const WatchedMovies = require('./database/WatchedMovies')
const OpenAI = require('openai');


app.use(express.json());
const corsOptions = {
    origin: 'https://movies-2-t3a2.onrender.com', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  
  app.use(cors(corsOptions));
connectt();

function midlogin(req, res, next){
    next();
}
app.get('/', (req, res) => {
    res.send('Welcome to the Movies API! Hey');
});
app.get('/login', (req, res) => {
    res.send('helo');
});
app.post('/', (req, res) => {
    res.send('Welcome to the Movies API! Hey');
});
app.post('/login', midlogin, async (req, res) => {
    console.log('Request Body:', req.body);

    try {
        const responsed = await Profile.find({ email: req.body.email }).exec();
        if (responsed.length > 0) {
            console.log('User already registered:', req.body.email);
            return res.json({ message: 'Already registered' });
        }
        
        const newData = new Profile({
            name: req.body.name,
            email: req.body.email,
            gauth: req.body.sub,
            picture: req.body.picture,
        });

        await newData.save();
        console.log('Data saved successfully:', newData);
        res.json({ message: 'Saved on the database' });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/test', (req, res) => {
    res.send('POST test route is working!');
});

app.post('/addRating', async (req, res) => {
    const { email, movie_ID, rating } = req.body;

    try {
        const watchedMovie = await WatchedMovies.findOne({ email });

        if (!watchedMovie) {
            const newWatchedMovie = new WatchedMovies({
                email,
                movie_id: [movie_ID],
                ratings: [{ movie_id: movie_ID, rating: rating }]
            });
            await newWatchedMovie.save();
            return res.json({ message: 'New entry added successfully' });
        } else {
            const existingRating = watchedMovie.ratings.find(r => r.movie_id === movie_ID);

            if (existingRating) {
                // If the movie ID exists, update the rating
                existingRating.rating = rating;
                await watchedMovie.save();
                return res.json({ message: 'Rating updated successfully' });
            } else {
                // If the movie ID doesn't exist, add a new rating entry
                watchedMovie.movie_id.push(movie_ID);
                watchedMovie.ratings.push({ movie_id: movie_ID, rating: rating });
                await watchedMovie.save();
                return res.json({ message: 'New rating added successfully' });
            }
        }
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/showRating', async (req, res)=>{
    const { email, movie_ID } = req.body;

    try {
        const watchedMovie = await WatchedMovies.findOne({ email });

        if (watchedMovie) {
            const existingRating = watchedMovie.ratings.find(r => r.movie_id === movie_ID);

            if (existingRating) {
                console.log(existingRating);
                await watchedMovie.save();
                return res.send({rating : existingRating.rating});
            } else {
                return res.send({rating : 0});
            }
        } else {
            return res.send({ rating: 0 });
          }
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/addWishlist', async (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const movie_ID = req.body.mvid;
  
    try {
      // Update the document if movie_ID is not already present in the movie_id array
      const response = await Wishlist.findOneAndUpdate(
        { email },
        { $addToSet: { movie_id: movie_ID } }, // Use $addToSet to ensure uniqueness
        { new: true, upsert: true } // Create a new document if not found
      );
  
      if (response) {
        console.log('Wishlist updated successfully:', response);
        return res.json({ message: 'Successfully updated the Wishlist', data: response });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      return res.status(500).json({ message: 'Failed to update wishlist', error: error.message });
    }
  });
  

app.post('/removeWishlist', async (req, res) => {
    const { email, mvid } = req.body;
    console.log(req.body);
    try {
        const updatedWishlist = await Wishlist.findOneAndUpdate(
            { email },
            { $pull: { movie_id: mvid } },
            { new: true }
        );

        if (!updatedWishlist) {
            return res.status(404).send({ message: 'Wishlist not found' });
        }

        res.send({ message: 'Successfully removed from the Wishlist', updatedWishlist });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send({ message: 'An error occurred while removing from the Wishlist' });
    }
});



app.post('/showWishlist', async (req, res) => {
    console.log('here :', req.body);
    const emaill = req.body.email;
    try{
        const responsed = await Wishlist.find({email : emaill}).exec();
        console.log(responsed)
        if (responsed)
            return res.send(responsed);
        else {
            return res.status(404).send('Wishlist not found');
        }
    }
    catch(error)
    {
        console.log("some error occurred here");
    }   
})

app.post('/showUserlist', async (req, res) => {
    console.log('here :', req.body);
    const emaill = req.body.email;
    try{
        const responsed = await UserLists.find({email : emaill}).exec();
        console.log(responsed)
        if (responsed)
            return res.send(responsed);
        else {
            return res.status(404).send('Wishlist not found');
        }
    }
    catch(error)
    {
        console.log("some error occurred here");
    }   
})

app.post('/showlist', async (req, res) => {
    console.log('here :', req.body);
    async function findListById(listId) {
        try {
            const list = await Lists.findById(listId);
            if (!list) {
                console.log('List not found');
                return null; 
            }
            return res.send(list);
        } catch (error) {
            console.error('Error finding list by ID:', error);
            throw error;
        }
    }   
    findListById(req.body.id)
})

app.post('/addlist', async (req, res) => {
    console.log('The list Data', req.body);
    const email = req.body.email;
    const list_name = req.body.newListName;
    const newData = new Lists({
        Name: list_name,
        movie_id: [],
    });
    const savedData = await newData.save();
    const doc_id = savedData._id;
    const updatedUserLists = await UserLists.findOneAndUpdate(
        { email },
        { $push: { list_id: doc_id } },
        { new: true }
    );
    if (updatedUserLists) {
        console.log('Successfully updated the UserLists:', updatedUserLists);
    } else {
        const newData1 = new UserLists({
            email: email,
            list_id: [doc_id],
          });
          const savedData1 = await newData1.save();
        console.log('Data saved successfully:', savedData1);
        }
    const data = [doc_id, list_name];
    res.json(data);   
})

app.post('/addtolist', async (req, res) => {
    console.log("ADDING the movie to the list : ", req.body);
    const lid = req.body.listID;
    const movie_ID = req.body.movie;
    try{
        const responsed = await Lists.findOneAndUpdate({ _id : lid }, { $push: { movies : movie_ID } }, { new: true });
        if (responsed)
            return res.send({message : 'Successfully updated the List'});
        else {
            return res.status(404).send('List not found');
        }
    }
    catch(error)
    {
        console.log("some error occurred here");
    }   
})

app.post('/show/listMovies', async (req, res) => {
    console.log(req.body);
    const lid = req.body.listid;

    try {
        const response = await Lists.find({_id: lid}).exec();
        
        if (response.length > 0) {
            console.log(response[0].movies);
            res.json({title : response[0].Name ,movies : response[0].movies});
        } else {
            return res.status(404).send('List not found');
        }
    } catch (e) {
        console.error('Error fetching list:', e);
        return res.status(500).send('Internal Server Error');
    }
});

app.post('/user/watchedmovies', async(req, res) => {
    console.log(req);
    const email = req.body.email;
    try {
        const response = await WatchedMovies.find({email : email});
        if (response){
            console.log(response[0].ratings);
            res.json(response[0].ratings);
        }
        else{
            return res.status(404).send('List not found');
        }
    }
    catch(e)
    {
        console.log("Error fetching User's watched movies");
        return res.status(500).send('Internal Server Error');
    }
})

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



