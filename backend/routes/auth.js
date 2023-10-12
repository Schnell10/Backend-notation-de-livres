const express = require('express')
const router = express.Router()

const authControllers = require('../controllers/auth')

router.post('/signup', authControllers.signup)
//Requete de connexion fausse, il faut pas ajouter l'user mais vérifier l'user
router.post('/login', authControllers.login)

module.exports = router
