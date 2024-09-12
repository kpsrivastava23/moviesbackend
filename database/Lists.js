const mongoose = require('mongoose');

const list = new mongoose.Schema({
    Name : {type : String, unique : true},
    createdAt: { type: Date, default: Date.now },
    movies : [{type : Number}],
})

const Lists = mongoose.model('Lists', list);
module.exports = Lists;