const mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    director: String,
    duration: Number,
    poster: String,
    genre: [String],
    rate: Number,
})

const Movie = mongoose.model('Movie', MovieSchema)

module.exports = Movie