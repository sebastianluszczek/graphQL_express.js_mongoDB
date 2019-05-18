const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const actorSchema = new Schema({
    name: String,
    age: Number
});

module.exports = mongoose.model('Actor', actorSchema);