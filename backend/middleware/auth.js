const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req, res, next) => {
   try {
      //On extrait le token du header (on utilise split pour enlever le Bearer
      const token = req.headers.authorization.split(' ')[1]
      //On récupére le secret token de .env
      const secretToken = process.env.secretToken
      //On décode le token
      const decodedToken = jwt.verify(token, secretToken)
      //On extrait l'Id du token
      const userId = decodedToken.userId
      req.auth = {
         userId: userId,
      }
      next() //On ajoute next() pour passer au middleware suivant
   } catch (error) {
      res.status(401).json({ error })
   }
}
