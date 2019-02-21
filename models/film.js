const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filmSchema = new Schema({
    name: String,
    genre: String,
    director_id: String,
    actors: [String]
});

module.exports = mongoose.model('Film', filmSchema);