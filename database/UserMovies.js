const mongoose = require('mongoose');

const watchedMovies = new mongoose.Schema({
    email : {type : String, unique : true},
    movie_id : Number,
    rating : Number,
    createdAt: { type: Date, default: Date.now },
})

const UserMovies = mognoose.model('UserMovies', watchedMovies);
module.exports = UserMovies;