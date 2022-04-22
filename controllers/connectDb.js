const mongoClient = require('mongodb').MongoClient;

const urlDb = 'mongodb://localhost:27017';
const dbname = 'apogee';
mongoClient.connect(urlDb, {useNewUrlParser: true, useUnifiedTopology: true}, function (error,client){
    if (error) throw error;
    exports.db = client.db(dbname);
    console.log('connexion à la db réussie');
  })