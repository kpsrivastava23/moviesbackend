const mongoose = require('mongoose');

const list = new mongoose.Schema({
    email : {type : String, unique : true},
    list_id : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lists' }]
})

const Lists = mongoose.model('User Lists', list);
module.exports = Lists;