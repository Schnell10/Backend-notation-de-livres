const multer = require('multer') //module pour gérer le téléchargement de fichiers dans les applications Express
const sharp = require('sharp') //module pour traiter l'image
const fs = require('fs').promises //module pour effectuer des opérations dans l'organisation des fichiers
const path = require('path') //module qui permet de créer, de modifier et de manipuler des chemins de fichiers

//On configure le stockage en mémoire avec multer (et pas sur le disk)
const storage = multer.memoryStorage()
//On spécifie à multer le storage à utiliser, et on met la méthode single pour dire qu'il s'agi d'un fichier unique
const handleFileUpload = multer({ storage: storage }).single('image')

const convertAndSaveToWebP = (req, res, next) => {
   //On gére le téléchargement du fichier grâce à handleFileUpload
   handleFileUpload(req, res, (uploadError) => {
      //Si une erreur est appellé:
      if (uploadError) {
         console.error(uploadError)
         return res
            .status(400)
            .json({ message: "Erreur lors du téléchargement de l'image." })
      }

      if (req.file) {
         const allowedMimeTypes = [
            'image/jpg',
            'image/jpeg',
            'image/png',
            'image/webp',
         ]
         const mimeType = req.file.mimetype

         if (!allowedMimeTypes.includes(mimeType)) {
            //On fait une condition pour vérifier que le fichier soit au bon format
            return res.status(400).json({
               message:
                  'Seules les images au format JPG, JPEG, PNG ou WebP sont autorisées.',
            })
         }

         sharp(req.file.buffer) //On utilise sharp pour redimensionner le fichier et convertir en webp
            .resize(400, 500)
            .webp({ quality: 40 })
            .toBuffer()
            .then((webpBuffer) => {
               //On renome le fichier enregistré en mémoire sous forme de tampon
               const name = req.file.originalname.split(' ').join('_') //en remplaçant les espaces par des _
               const fileName = name.split('.').shift() + Date.now() + '.webp' // on extrait le nom du fichier d'origine avant l'extension et on ajoute l'horodatage et l'extension webp
               //On défini le chemin de destination du fichier
               const filePath = path.join(__dirname, '..', 'images', fileName)

               return fs
                  .writeFile(filePath, webpBuffer) //On enregistre le contenu du tampon (webBuffer) dans un fichier sur la destination défini (filePath)
                  .then(() => {
                     //On modifie les données de la requête pour pouvoir la traiter avec d'autre middleware ou controllers
                     req.file = {
                        ...req.file,
                        path: filePath, //On remplace le chemin du fichier de la requête
                        filename: fileName, //On remplace le nom du fichier de la requête
                        destination: '../images', //On indique le dossier de destination
                     }
                     next()
                  })
                  .catch((error) => {
                     console.error(error)
                     res.status(400).json({
                        message: "Erreur lors de l'enregistrement de l'image.",
                     })
                  })
            })
            .catch((error) => res.status(400).json(error))
      } else {
         //Si audun fichier est dans la requête on peu continuer sans conversion
         next()
      }
   })
}

module.exports = convertAndSaveToWebP
