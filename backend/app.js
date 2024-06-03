const express = require('express')
const helmet = require('helmet')
require('dotenv').config() //Module dotenv pour la gestion des variables d'environnement
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')

const booksRoutes = require('./routes/books')
const authRoutes = require('./routes/auth')

//On récupére le mdp mongoDb du fichier .env
const mongoDbPassword = process.env.mongoDbPassword
//On connecte notre serveur à mongoDB
mongoose
   .connect(mongoDbPassword, {
      useNewUrlParser: true, //activer le nouveau parseur d'URL
      useUnifiedTopology: true, //active l'utilisation du nouveau moteur de découverte et de surveillance de serveur dans Mongoose
   })
   .then(() => console.log('Connexion à MongoDB réussie !'))
   .catch(() => console.log('Connexion à MongoDB échouée !'))

const app = express() //On crée une instance de l'application Express

// Utilisation de Helmet comme middleware  (c'est une librairie JavaScript qui offre un ensemble de fonctions middleware pour renforcer la sécurité en ajoutant des en-têtes HTTP de sécurité)
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))

//On gère les en-têtes CORS
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*') //n'importe quel domaine est autorisé à faire des requêtes vers ce serveur
   res.setHeader(
      //On définit les en-têtes HTTP autorisés dans une requête
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
   )
   res.setHeader(
      // On définit les méthodes HTTP autorisées dans une requête
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS'
   )
   next()
})

//middleware pour analyser le contenu JSON des requêtes
//(extrait les données JSON de la demande entrante et les rend disponibles dans un format JavaScript)
app.use(bodyParser.json())

//routes
app.use('/api/books', booksRoutes)
app.use('/api/auth', authRoutes)
//On indique à Express qu'il faut gérer la ressource images de manière statique à chaque fois qu'elle reçoit une requête vers la route /images
//Toutes les requêtes HTTP commençant par /images seront gérées par le middleware express.static
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app
