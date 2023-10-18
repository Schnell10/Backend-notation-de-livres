const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')

const booksRoutes = require('./routes/books')
const authRoutes = require('./routes/auth')

//On connecte notre serveur à mongoDB
mongoose
   .connect(
      'mongodb+srv://pierreschnell:KawpvfOpJigpW9b2@cluster0.imkg8df.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp',
      { useNewUrlParser: true, useUnifiedTopology: true }
   )
   .then(() => console.log('Connexion à MongoDB réussie !'))
   .catch(() => console.log('Connexion à MongoDB échouée !'))

const app = express()

//On gère les en-têtes CORS
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*')
   res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
   )
   res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS'
   )
   next()
})

app.use(bodyParser.json())

//routes
app.use('/api/books', booksRoutes)
app.use('/api/auth', authRoutes)
app.use('/images', express.static(path.join(__dirname, 'images'))) //indique à Express qu'il faut gérer la ressource images de manière statique à chaque fois qu'elle reçoit une requête vers la route /images

module.exports = app
