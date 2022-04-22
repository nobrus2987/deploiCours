//importation du package http qui permet de créer le server 
const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');  // permet d'utiliser un fichier .env
dotenv.config();

// La fonction suivante vérifie que le port est correct (>=0) et si c'est une URL il inscrit l'url.
const normalizePort = val => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  };
  
  const port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);

  //gestion des erreurs
  const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

  server.listen(port);

