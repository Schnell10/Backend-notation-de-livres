const multer = require('multer')

const MIME_TYPES = {
   'image/jpg': 'jpg',
   'image/jpeg': 'jpg',
   'image/png': 'png',
}

const storage = multer.diskStorage({
   //diskStorage indique qu'on enregistre sur le disque
   destination: (req, file, callback) => {
      //Indique à multer où enregistrer les fichier (ici 'images')
      callback(null, 'images')
   },
   filename: (req, file, callback) => {
      //Explique à multer quel nom de fichier utiliser
      const name = file.originalname.split(' ').join('_') //On supprimer les espaces pour les remplacer par des _
      const extension = MIME_TYPES[file.mimetype] //On choisi le minetype qui correspond au minetype du fichier
      callback(null, name + Date.now() + '.' + extension) //On ajotue date.now() pour pas créer des fichiers au nom identique
   },
})

module.exports = multer({ storage }).single('image') //On met la méthode single pour dire qu'il s'agi d'un fichier unique
