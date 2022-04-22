const conn = require('./connectDb')
var ObjectId = require('mongodb').ObjectID;
const { DateTime } = require("luxon");
const dotenv = require('dotenv');  // permet d'utiliser un fichier .env
dotenv.config();

// installer bcrypt ave npm
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

exports.inscription = (req,res,callback) => {
    conn.db.collection('users').findOne({email:req.body.email},function(err,data){
        if(data){
            res.status(400).json({error:'Cet utilisateur existe déjà'})
        }else{
            bcrypt.hash(req.body.password, 10)  // 10 signifie qu'on execute 10 fois l'algorythme de hashage (plus on en execute plus c'est sécure mais plus ça prend du temps: 10 c'est bien!)
            .then( passwordHashed => {
                conn.db.collection('users').insertOne({
                    email: req.body.email,
                    password: passwordHashed,
                }, function (err, record) {
                    if (!err) {res.status(201).json({message: 'utilisateur bien enregistré'})}
                    else {res.status(400).json({ error })}
                }) 
            })
            .catch(error => res.status(400).json({ error })); // err =>   quand une fonction flêché ne prend qu'un argument on peut le mettre directement en toute lettre sans paranthèse)
        }
    })
}

exports.connexion = (req,res,callback) => {
    conn.db.collection('users').findOne({"email": req.body.email}, function(err,datas){
        if (!datas){
            return res.status(401).json({ message: "L'adresse mail n'existe pas" });
        } else {
            bcrypt.compare(req.body.password, datas.password)
            .then ( valid => {
                if(!valid) {
                    return res.status(401).json({message: "mot de passe incorrect"});
                }
                res.status(200).json({
                    message: 'connexion réussie',
                    userId: datas._id,
                    token: jwt.sign(
                        {userId: datas._id},
                        process.env.TOKEN_KEY,
                        {expiresIn: '6h'}
                    )
                })
            })
        }
    })
}

exports.getAllArticles = (req,res) => {               // .sort({createdDate:1})  =  affiché dans l'ordre croissant de date; si on veut décroissant: on met -1
    AllArticles = conn.db.collection('articles').find().sort({createdDate:-1}).toArray(function (err, datas){
        if(datas){
            return res.status(201).json({articles: datas})
        } else {
            console.log(err)
        }
    })
}

exports.getOneArticle = (req, res) => {
    article = conn.db.collection('articles').findOne({_id: new ObjectId(req.params.id)}, function(err, datas) {
        return res.status(201).json({article: datas})
    })
}

exports.getsixLastArticles = (req,res) => {
    conn.db.collection('articles').find({},{projection:{titre:1}}).limit(4).sort({createdDate:-1}).toArray(function (err, datas){
        if(datas){
            return res.status(201).json({articles:datas})
        } else {
            res.status(400).json({message:err})
        }
    })
}

exports.getFutureEvent = (req,res) => {
    conn.db.collection('evenements').find({dateEvnmt:{$gt: DateTime.now().toISO()}},{'titre':1}).limit(4).sort({dateEvnmt:-1}).toArray(function (err, datas){
        if(datas){
            return res.status(201).json({articles:datas})
        } else {
            res.status(400).json({message:err})
            console.log(err)
        }
    })
}

exports.getAllEvenements = (req,res) => {               // ici on affiche dans l'ordre croissant de la date de l'évènement
    AllEvenements = conn.db.collection('evenements').find().sort({dateEvnmt:-1}).toArray(function (err, datas){
        if(datas){
            datas.forEach(element => {
                dateComplete= DateTime.fromISO(element.dateEvnmt).toFormat("dd'-'LL'-'y'-'HH'-'mm").split("-")
                dateEvnmt= dateComplete[0]+'-'+dateComplete[1]+'-'+dateComplete[2]
                element.dateEvnmt= dateEvnmt
                heureEvnmt = dateComplete[3]+':'+dateComplete[4]
                element.heureEvnmt= heureEvnmt                
            });
            return res.status(201).json({articles: datas})
        } else {
            console.log(err)
        }
    })
}

exports.getOneEvenement = (req, res) => {
    article = conn.db.collection('evenements').findOne({_id: new ObjectId(req.params.id)}, function(err, datas) {
        dateComplete= DateTime.fromISO(datas.dateEvnmt).toFormat("dd'-'LL'-'y'-'HH'-'mm").split("-")
        dateEvnmt= dateComplete[0]+'-'+dateComplete[1]+'-'+dateComplete[2]
        datas.dateEvnmt= dateEvnmt
        heureEvnmt = dateComplete[3]+':'+dateComplete[4]
        datas.heureEvnmt= heureEvnmt
        return res.status(201).json({article: datas})
    })
}

exports.getAllWorkshops = (req,res) => {               
    AllArticles = conn.db.collection('workshops').find({},{projection:{corps: 0,images:{"$slice": 1}}}).sort({dateEvnmt:-1}).toArray(function (err, datas){
        if(datas){
            datas.forEach(element => {
                dateComplete= DateTime.fromISO(element.dateEvnmt).toFormat("dd'-'LL'-'y'-'HH'-'mm").split("-")
                dateEvnmt= dateComplete[0]+'-'+dateComplete[1]+'-'+dateComplete[2]
                element.dateEvnmt= dateEvnmt
                heureEvnmt = dateComplete[3]+':'+dateComplete[4]
                element.heureEvnmt= heureEvnmt                
            });
            return res.status(201).json({articles: datas})
        } else {
            console.log(err)
        }
    })
}

exports.getOneWorkshop = (req, res) => {
    article = conn.db.collection('workshops').findOne({_id: new ObjectId(req.params.id)}, function(err, datas) {
        dateComplete= DateTime.fromISO(datas.dateEvnmt).toFormat("dd'-'LL'-'y'-'HH'-'mm").split("-")
        dateEvnmt= dateComplete[0]+'-'+dateComplete[1]+'-'+dateComplete[2]
        datas.dateEvnmt= dateEvnmt
        heureEvnmt = dateComplete[3]+':'+dateComplete[4]
        datas.heureEvnmt= heureEvnmt
        return res.status(201).json({article: datas})
    })
}

// Requête mongo: ici la projection permet de définir le nombre de valeur dans un field grâce à l'opérateur "$slice": projection:{images:{"$slice": 1}}} --> on ne récupère que la première photo pour la liste
// cela permet d'éviter de faire une requête plus lourde que nécessaire
exports.getListeAlbums = (req,res) => {
    listeAlbum = conn.db.collection('galerie').find({},{projection:{images:{"$slice": 1}}}).toArray(function(err, datas) {
        return res.status(201).json({albumsListe: datas})
    })
}

exports.getOneAlbum = (req,res) => {
    album = conn.db.collection('galerie').findOne({_id: new ObjectId(req.params.id)}, function(err, datas) {
        return res.status(201).json({album: datas})
    })
}

exports.getAllContentListe = (req,res) => {

    function getAllListes (){
        return new Promise(function(resolve, reject) {
            conn.db.collection('evenements').find({},{projection:{titre:1,createdDate:1,dateEvnmt:1}}).sort({dateEvnmt:-1}).toArray(function (err,datas1){
                if(datas1){
                    datas1.forEach(element =>{
                        date = new DateTime(element.createdDate).toLocaleString(),
                        element.createdDate = date})
                    var evenements = datas1
                    conn.db.collection('workshops').find({},{projection:{titre:1,createdDate:1,dateEvnmt:1,placeRestante:1}}).sort({dateEvnmt:-1}).toArray(function (err, datas2){
                        if(datas2){
                            datas2.forEach(element =>{
                                date = new DateTime(element.createdDate).toLocaleString(),
                                element.createdDate = date})
                            var workshops = datas2
                            conn.db.collection('articles').find({},{projection:{titre:1,createdDate:1}}).toArray(function (err, datas3) {
                                if(datas3) {
                                var articles = datas3
                                datas3.forEach(element =>{
                                    date = new DateTime(element.createdDate).toLocaleString(),
                                    element.createdDate = date})
                                var allListe = new Object();
                                allListe.evenementsListe = evenements
                                allListe.workshopsListe = workshops
                                allListe.articlesListe = articles
                                resolve(allListe)
                                }
                                else {
                                    console.log(err)
                                    reject(err)
                                }
                            })
                        } else {
                            reject(err) 
                        }
                    })
                } else {
                    reject(err)
                }
            })            
        })
    }

    getAllListes()
        .then(function(resultat){
            res.status(201).json({
                listeArticle : resultat.articlesListe,
                listeWorkshop : resultat.workshopsListe,
                listeEvenement : resultat.evenementsListe
            })
        })
        .catch(function(err) {
            console.log(err)
        })
}