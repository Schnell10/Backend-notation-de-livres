const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
require('dotenv').config()

exports.signup = (req, res, next) => {
   //On appel la fonction de hachage de bcrypt pour « saler » le mot de passe 10 fois
   bcrypt
      .hash(req.body.password, 10)
      //Puis on crée l'utilisateur en l'enregistrant dans la base de donnée avec le mdp hashé
      .then((hash) => {
         //Création d'une nouvelle instance de modèle utilisateur
         const user = new User({
            email: req.body.email,
            password: hash,
         })
         user
            .save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch((error) => res.status(400).json({ error }))
      })
      .catch((error) => res.status(500).json({ error }))
}

exports.login = (req, res, next) => {
   //On récupére le secret token de .env
   const secretToken = process.env.secretToken

   // Recherche de l'utilisateur dans la base de données par son adresse e-mail
   User.findOne({ email: req.body.email })
      .then((user) => {
         //Si aucun utilisateur correspond on renvoit le msg d'erreur
         if (!user) {
            return res
               .status(401)
               .json({ message: 'Paire login/mot de passe incorrecte' })
         }
         //On se sert de bcrypt pour comparer le mdp de la requête avec le mdp hashé dans la base de donnée
         bcrypt
            .compare(req.body.password, user.password)
            .then((valid) => {
               if (!valid) {
                  return res
                     .status(401)
                     .json({ message: 'Paire login/mot de passe incorrecte' })
               }
               res.status(200).json({
                  //On renvoit l'identifiant de l'utilisateur et le JWT
                  userId: user._id,
                  //On remplie le jwt avec l'userId, le secretToken
                  token: jwt.sign({ userId: user._id }, secretToken, {
                     expiresIn: '24h',
                  }),
               })
            })
            .catch((error) => res.status(500).json({ error }))
      })
      .catch((error) => res.status(500).json({ error }))
}
