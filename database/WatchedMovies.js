const mongoose = require('mongoose');

const movies = new mongoose.Schema({
    email : {type : String, unique : true},
    movie_id : [{type : Number}],
    ratings: [{ movie_id: Number, rating: Number }],
})

const WatchedMovies = mongoose.model('Watched Movies', movies);
module.exports = WatchedMovies;