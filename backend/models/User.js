const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator') //Bibliothèque Node.js qui simplifie la gestion de la validation des contraintes d'unicité

const userSchema = mongoose.Schema({
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)
