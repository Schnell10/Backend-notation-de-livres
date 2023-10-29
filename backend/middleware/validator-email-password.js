const validator = require('@hapi/address')

module.exports = (req, res, next) => {
   // On vérifie que l'email et le mdp sont complétés
   if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: 'Champs incomplets' })
   }

   // On vérifie l'adresse email grâce à la bibliothèque @hapi/adress
   if (!validator.isEmailValid(req.body.email)) {
      return res.status(400).json({ message: 'Adresse email non valide' })
   }

   // On vérifie que le mot de passe est composé d'au moins 8 caractères et soit différent de l'email.
   if (req.body.password.length < 7 || req.body.password === req.body.email) {
      return res.status(400).json({
         message:
            "Mot de passe non valide, il dois contenir au moins 8 caractères ou être différent de l'email",
      })
   }

   next()
}
