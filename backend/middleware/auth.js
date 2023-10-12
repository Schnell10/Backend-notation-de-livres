const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
   try {
      //On extrait le token du header (on utilise spleet poru enlever le Bearer)
      const token = req.headers.authorization.split(' ')[1]
      //On décode le token
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
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
