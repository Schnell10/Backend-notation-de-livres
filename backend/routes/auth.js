const express = require('express')
const router = express.Router()

const authControllers = require('../controllers/auth')
const validator = require('../middleware/validator-email-password')

router.post('/signup', validator, authControllers.signup)
//Requete de connexion fausse, il faut pas ajouter l'user mais vérifier l'user
router.post('/login', authControllers.login)

module.exports = router
