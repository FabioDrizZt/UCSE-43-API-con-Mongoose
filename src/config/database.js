const mongoose = require('mongoose')
process.loadEnvFile()

const connectDB = () => {
    mongoose.connect(process.env.URI)
        .then(() => console.log('Conectado a MongoDB'))
        .catch((err) => console.log(err))
}

module.exports = connectDB