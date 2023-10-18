const Book = require('../models/Book')
const fs = require('fs')

exports.createBook = (req, res, next) => {
   const bookObject = JSON.parse(req.body.book) //on analyse l'objet book qui est convertie en chaîne grâce à JSON.parse()
   delete bookObject._id
   delete bookObject.userId
   const book = new Book({
      //On crée un objet livre contenant les propriétées contenu dans bookObject,
      ...bookObject,
      //on change l'userId par l'id extrait du header de la requête pour plus de sécurité
      userId: req.auth.userId,
      //On récupère l'adress url de l'image reçu dans la requête
      imageUrl: `${req.protocol}://${req.get('host')}/images/${
         req.file.filename
      }`,
      averageRating: 0,
   })

   book //On enregistre ce nouveau livre dans la base de donnée
      .save()
      .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
      .catch((error) => {
         console.log(error) // Journalisation de l'erreur
         res.status(400).json({ error })
      })
}

exports.addRatingBook = (req, res, next) => {
   //On vérifie que les notes envoyées dans la requête sont entre 1 et 5

   //On crée un objet pour mettre dans le sous tableau ratings
   const ratingObject = {
      userId: req.auth.userId,
      grade: req.body.rating,
   }
   Book.findByIdAndUpdate(
      { _id: req.params.id },
      //On push l'objet dans le tableau ratings
      { $push: { ratings: ratingObject } },
      //On renvoit l'objet mis à jour
      { new: true }
   )
      .then((book) => {
         //On crée un tableau contenant toutes les notes du livre
         const allRatings = book.ratings.map((rating) => rating.grade)
         //On additionne toutes ces valeurs.
         const sumRatings = allRatings.reduce(
            (total, rating) => total + rating,
            0
         )
         //On fait la moyenne (On affiche maximum 2 chiffres après la virgule)
         const averageRatings =
            Math.round((sumRatings / allRatings.length) * 100) / 100

         // On met à jour la propriété averageRatings de l'objet book
         book.averageRating = averageRatings

         //On enregistre la valeur averageRatings dans la base de donnée
         book
            .save(book)
            .then(() => {
               console.log(req.params.id)
               res.status(201).json(book)
            })
            .catch((error) => res.status(401).json({ error }))
      })
      .catch((error) => {
         console.log(req.body)
         console.log(req.params.id)
         console.log(req.auth.userId)
         console.log(error)
         res.status(500).json({ error })
      })
}

exports.getAllBooks = (req, res, next) => {
   Book.find()
      .then((books) => res.status(200).json(books))
      .catch((error) => res.status(400).json({ error }))
}

exports.getOneBook = (req, res, next) => {
   Book.findOne({ _id: req.params.id }) //On se sert de l'id de la req pour récupérer les données dans la base de données
      .then((book) => res.status(200).json(book))
      .catch((error) => res.status(404).json({ error }))
}

exports.getThreeBestBooks = (req, res, next) => {
   //Mauvais code en attendans
   Book.find()
      .sort({ averageRating: -1 }) // Tri par note moyenne décroissante
      .limit(3) // Limitez à trois résultats
      .then((books) => res.status(200).json(books))
      .catch((error) => res.status(500).json({ error }))
}

exports.modifyBook = (req, res, next) => {
   const bookObject = req.file
      ? //On fait une condition: si dans la requête il y a un fichier,
        //on analyse l'objet book qui est convertie en chaîne grâce à JSON.parse() et on reconstitue l'url de l'image
        {
           ...JSON.parse(req.body.book),
           imageUrl: `${req.protocol}://${req.get('host')}/images/${
              req.file.filename
           }`,
        }
      : //Si la requête ne contien pas de fichier on traite simplement l'objet entrant
        { ...req.body }

   delete bookObject._userId
   Book.findOne({ _id: req.params.id }) //On récupère l'objet de la base de donnée grâce à son id
      .then((book) => {
         if (book.userId != req.auth.userId) {
            //On vérifie si c'est bien l'utilisateur qui à crée cette objet
            res.status(403).json({ message: 'Not authorized' })
         } else {
            Book.updateOne(
               //Si c'est le cas, on modifie l'objet
               { _id: req.params.id },
               { ...bookObject, _id: req.params.id }
            )
               .then(() => res.status(200).json({ message: 'Livre modifié !' }))
               .catch((error) => res.status(401).json({ error }))
         }
      })
      .catch((error) => {
         res.status(400).json({ error })
      })
}

exports.deleteBook = (req, res, next) => {
   Book.findOne({ _id: req.params.id }) //On récupère l'objet de la base de donnée grâce à son id
      .then((book) => {
         //On vérifie si c'est bien l'utilisateur qui à crée cette objet
         if (book.userId != req.auth.userId) {
            res.status(403).json({ message: 'Not authorized' })
         } else {
            const filename = book.imageUrl.split('/images/')[1] //On récupère le nom de notre fichier (à la suite de /images/)
            fs.unlink(`images/${filename}`, () => {
               //on utilise la fonction unLing de fs (package node pour pouvoir modifier les fichiers) pour supprimer le fichier
               Book.deleteOne({ _id: req.params.id }) //Puis on supprime l'objet de la base de donnée
                  .then(() =>
                     res.status(200).json({ message: 'Livre supprimé !' })
                  )
                  .catch((error) => res.status(401).json({ error }))
            })
         }
      })
      .catch((error) => {
         res.status(500).json({ error })
      })
}
