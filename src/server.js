// Conectamos a MongoDB usando Mongoose
const connectDB = require('./config/database')
connectDB()

// Traemos el modelo de Movie
const Movie = require('./models/Movie')

// Traemos express
const express = require('express')
const app = express()

// Middleware para recibir JSON
app.use(express.json())

// Endpoint raiz
app.get('/', (req, res) => {
    res.send('Bienvenido a la API de peliculas 🎬')
})

// Definimos el endpoint para obtener todos los películas
app.get('/movies/', (req, res) => {
    const atributo = { ...req.query }
    query = !atributo ? {} : atributo 
    // Si no hay género especificado, obtendremos todas las películas
    Movie.find(query)
        .then(movies => res.json(movies))
        .catch(error => res.status(500).json({ message: 'Error interno del servidor', error }))
})

// Definimos el endpoint para obtener una película por id
app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    Movie.findById(id)
        .then(movie => {
            if (!movie) return res.status(404).json({ message: 'Pelicula no encontrada' })
            res.json(movie)
        })
        .catch(error => res.status(500).json({ message: 'Error interno del servidor', error }))
})

// Definimos el endpoint para buscar películas por título
app.get('/movies/search/:title', (req, res) => {
    const { title } = req.params
    Movie.find({ title: { $regex: title, $options: 'i' } })
        .then(movies => res.json(movies))
        .catch(error => res.status(500).json({ message: 'Error interno del servidor', error }))
})

// Mostrar peliculas en un rango de años

app.get('/movies/range/:startYear/:endYear', (req, res) => {
    const { startYear, endYear } = req.params
    Movie.find({ startYear: { $gte: parseInt(startYear), $lte: parseInt(endYear) } })
        .then(movies => res.json(movies))
        .catch(error => res.status(500).json({ message: 'Error interno del servidor', error }))
})

// Definimos el endpoint para crear una película
app.post('/movies/', (req, res) => {
    const newMovie = new Movie(req.body)
    newMovie.save()
        .then(movie => res.status(201).json(movie))
        .catch(error => res.status(400).json({ message: 'Error al agregar la pelicula', error }))
})

// Definimos el endpoint para actualizar una película
app.put('/movies/:id', (req, res) => {
    Movie.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(movie => {
            if (!movie) return res.status(404).json({ message: 'Pelicula no encontrada' })
            res.json(movie)
        })
        .catch(error => res.status(500).json({ message: 'Error interno del servidor', error }))
})

// Definimos el endpoint para borrar una pelicula
app.delete('/movies/:id', (req, res) => {
    Movie.findByIdAndDelete(req.params.id)
        .then(movie => {
            if (!movie) return res.status(404).json({ message: 'Pelicula no encontrada' })
            res.status(200).json({ message: 'Pelicula eliminada correctamente' })
        })
        .catch(error => res.status(500).json({ message: 'Error interno del servidor', error }))
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
})
