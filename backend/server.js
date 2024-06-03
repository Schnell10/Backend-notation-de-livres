const http = require('http') //module HTTP inclus dans Node.js
const app = require('./app')

//normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = (val) => {
   //On essaie de convertir val en entier base 10
   const port = parseInt(val, 10)
   //Si port est NaN (Not-a-Number), val n'est pas un nombre donc on le retourne tel quel
   if (isNaN(port)) {
      return val
   }
   if (port >= 0) {
      return port
   }
   return false
}
// On configure le serveur pour qu'il écoute sur le port spécifié dans la variable d'environnement ou le port 4000
const port = normalizePort(process.env.PORT || '4000')
app.set('port', port)

//On attrape les différentes erreurs afin de les gèrer de manière appropriée
const errorHandler = (error) => {
   if (error.syscall !== 'listen') {
      throw error
   }
   const address = server.address()
   const bind =
      typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
   switch (
      error.code //On examine le code de l'erreur pour décider de l'action à prendre
   ) {
      case 'EACCES':
         console.error(bind + ' requires elevated privileges.')
         process.exit(1)
         break
      case 'EADDRINUSE':
         console.error(bind + ' is already in use.')
         process.exit(1)
         break
      default:
         throw error
   }
}

//On crée un serveur HTTP qui utilise notre application Express
const server = http.createServer(app)
//On gére les erreurs du serveur
server.on('error', errorHandler)
//On écoute les demandes entrantes sur le port
server.on('listening', () => {
   const address = server.address()
   const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
   console.log('Listening on ' + bind)
})

//On démarre le serrver en écoutant sur le port configuré
server.listen(port)
