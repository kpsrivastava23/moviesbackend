const mongoose = require('mongoose');

const wish = new mongoose.Schema({
    email : {type : String, unique : true},
    movie_id : [{type : Number}],
})

const Wishlist = mongoose.model('User Wishlists', wish);
module.exports = Wishlist;