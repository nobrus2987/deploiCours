const express = require('express');
const helmet = require('helmet')  // module pour la protection contre les attaques XSS

// Ici on import le router de stuff (= trucs: nom qu'on a donnée pour cette partie de notre application)
//RAPPEL: le . avant le / en début d'URL permet de dire qu'on cherche autre part que dans les modules node (contenu dans node_modules) 

const usersRoutes = require('./routes/usersRoutes');
const adminRoutes = require('./routes/adminRoutes');


// on créé l'application qui est l'exécution de express
const app = express();

app.use(helmet());

// Par défaut, si on créé des requête GET ou POST ou autre, le front-end affichera une erreur cors (Cross Origin Ressource Sharing). C'est une protection par défaut qui empêche
// l'envoi de requête malveillante au serveur par des robot ou autre. Mais ici, on veut que tout le monde puisse avoir accès à l'application.
// Pour évité cette sécurité, il faut rajouter des headers à notre réponse (avec la méthode setHeader) qui spécifieront que la réponse envoyée par le backend peut être utilisé par le front.
// 'Access-Control-Allow-Origin', '*'  ===> Pour ce qui est de l'accès, on autorise tout le monde grâce à l'argument '*';
//'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization' ===> Donne l'autorisation d'utiliser certains headers sur l'objet requête--> 
// Laligne 'Access-Control-Allow-Headers' est TRES IMPORTANTE surtout pour 'Authorization' que l'on va utiliser pour y mettre le Token dans les requêtes qui doivent être authentifiées.
// 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'  ===> Donne l'autorisation d'utiliser dans les requêtes les méthodes mises en argument: GET, POST, PUT ...

// ATTENTION: Ne pas oublié de mettre la méthode next à la fin du middleware pour que la fonction qui vient après soit bien exécutée. Sans ça la réponse se limittera à ce middleware

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Content, Accept, Content-Type, Authorization,userId');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Express.json permet que chaque donné soient traduit en json pour être facilement utilisable
app.use(express.urlencoded({
  extended:"true"
  }
));
app.use(express.json());

// Ici on créé un app.use qui va faire appelle au router de stuff ('stuffRoutes' : voir le require en haut du script) pour toutes les requêtes dont l'URL commence par '/api/stuff' 
// et qui concerne donc la partie stuff de notre API
// De cette on peut séparer différentes parties du code pour rendre le code plus claire et la maintenance/modification plus facile
// A la différence des middleware ci-dessus,  celui-ci à un argument en plus: une adresse '/api/stuff' : C'est un string qui donne la route pour laquelle la fonction  
// doit être appelée: Donc ici, pour que cette fonction soit exécutée, il faut que le frontend appel non pas juste le server mais le server et cette route /api/stuff  spécifiquement
app.use('/users', usersRoutes);
app.use('/admin', adminRoutes);

// on exporte l'application pour y avoir accès dans les autres fichier (notamment dans notre serveur)
module.exports = app ;

