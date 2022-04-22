const path = require('path')
const conn = require('./connectDb')
const date = require('./formatDate')  // Une fonction a été créé pour pouvoir rapidement avoir la date au format iso (necessaire pour l'envoie dans base de donné mongoDb)
var ObjectId = require('mongodb').ObjectID;
const { DateTime } = require("luxon");

// fs est un module qui permet de supprimer des fichiers: on require 'fs/promise' car c'est la fonction du module qui permet d'utiliser le module avec des promesses 
const fs = require('fs');   //module pour manipuler des fichiers

const pathImg = path.join(__dirname,'../','../','frontend/apogee/public/imgArticles/');

// création d'un tableau dans lequel on mettra tous les noms de photo uploader pour pouvoir les supprimer si l'article n'est pas enregistré
var imgTab = [];

exports.saveArticleImg = (req,res) => {
    res.json({location: '../imgArticles/'+ nameImg })
    imgTab.push(nameImg)
}

exports.deleteImg = (req,res) => {
    imgTab.forEach(images =>
    fs.unlinkSync(ImgToDelete = pathImg+images),
    imgTab = [],
    )    
}

exports.recordArticle = (req,res) => {
    corps = req.body.corps
    var imgIndex = []   // tableau qui récupèrera l'index de chaque image dans le corps de l'article 
    var imgCorps = []
    var imgUploadButNotRecorded = []

    // fonction pour remplir le tableau imgIndex avec les index de la preimère lettre de'imgArt-' de chaque photo
    var pos = corps.indexOf('imgArt-')  // indexOf = recherche de l'index de la première occurence de imgArt- dans le corps de l'article 
    while (pos != -1){  // pos = -1 = il n'y a plus d'occurence de la chaîne recherché; donc tant que pos n'est pas égal à -1; on continue la recherche
        imgIndex.push(pos),  // on insert l'index de l'image dans le tableau
        pos = corps.indexOf( "imgArt-",pos + 1 ); // on redémarre une recherche en partant du dernier index trouvé + 1
    }

    // fonction pour extraire le nom de chaques images de l'articles grâce à leur index récupéré précédemment
    imgIndex.forEach(index =>        // la fonction substring extrait une chaine de caractère d'une autre en fonction de l'index (n° de placement d'un caractère dans une chaîne)
        imgCorps.push(corps.substring(index, index + 24))   // Toutes les images ont un nom de la même taille, on peut donc extraire leur nom en mettant
        )                                                   // la taille exact du nom de l'image en additionnant l'index de l'image dans le texte avec la taille exact du nom de l'image (en nombre de caractèrre)

    // Boucle pour comparer le tableau des images uploadées et celles que l'on retrouve effectivement dans l'article
    // Celle qui ont été uploadée sans être présentes dans l'article seront supprimées
    imgTab.forEach(imgUploaded => {
        var todelete = 1
        for (var i = 0 ; i < imgCorps.length; i++) {
                if(imgCorps[i] == imgUploaded){
                    todelete = 0
                }
            }
            if (todelete>0){
                imgUploadButNotRecorded.push(imgUploaded)
            }
            todelete = 1;
        }
    )
    imgUploadButNotRecorded.forEach(ImgNotrecord => {
        imgFile = pathImg+ImgNotrecord
        if (fs.existsSync(imgFile)){    // Attention, il faut vérifier si l'image est bien présente avant de tenter de l'effacer
            fs.unlinkSync(img = imgFile)  // suppression des images uploadées mais non présentes dans l'article.
        }else{
            console.log("l'image n'existe pas")
        }
    })

    // var dateEvnmt = date.dateIso(req.body.dateEvnmt,req.body.heureEvnmt)
    switch(req.body.typeContenu){
        case 'article':
            conn.db.collection('articles').insertOne({
                titre: req.body.titre,
                corps: req.body.corps,
                resume: req.body.resume,
                imgArticle: imgCorps,
                createdDate: DateTime.now().toISO()
            },function(err, datas){
                if(!err){
                    res.status(201).json({message:'enregistrement ok'})
                } else {
                    console.log(err)
                    res.status(400)
                }                
            })
            break;
        case 'evenement':
            var dateDelEvnmt = date.dateIso(req.body.dateEvnmt,req.body.heureEvnmt)

            conn.db.collection('evenements').insertOne({
                titre: req.body.titre,
                corps: req.body.corps,
                resume: req.body.resume,
                imgArticle: imgCorps,
                dateEvnmt: dateDelEvnmt,
                createdDate: DateTime.now().toISO(),
                adresse: {
                    nVoie: req.body.nVoie,
                    commune: req.body.commune,
                    zip: req.body.zip,
                    description:req.body.description,
                }
            },function(err, datas){
                if(!err){
                    res.status(201).json({message:'enregistrement ok'})
                } else {
                    console.log(err)
                    res.status(400)
                }   
            })
            break;
            case 'workshop':
                var dateDelEvnmt = date.dateIso(req.body.dateEvnmt,req.body.heureEvnmt)
    
                conn.db.collection('workshops').insertOne({
                    titre: req.body.titre,
                    corps: req.body.corps,
                    resume: req.body.resume,
                    imgArticle: imgCorps,
                    dateEvnmt: dateDelEvnmt,
                    nbrPlace: req.body.nbrPlace,
                    placeRestante: req.body.nbrPlace,
                    createdDate: DateTime.now().toISO(),
                    adresse: {
                        nVoie: req.body.nVoie,
                        commune: req.body.commune,
                        zip: req.body.zip,
                        description:req.body.description,
                    }
                },function(err, datas){
                    if(!err){
                        res.status(201).json({message:'enregistrement ok'})
                    } else {
                        console.log(err)
                        res.status(400)
                    }    
                })
                break;             
    }
    imgTab = []
}

exports.updateArticle = (req,res) => {
    req.body.imagesAncienneVersion.forEach(images => // req.body.imgArticle ne contient que les photos qui étaient présentes avant modification de l'article
        imgTab.push(images))

    corps = req.body.corps
    var imgIndex = []
    var imgCorps = []
    var imgUploadButNotRecorded = []

    pos = corps.indexOf('imgArt-')
    while (pos != -1){
        imgIndex.push(pos),
        pos = corps.indexOf( "imgArt-",pos + 1 );
    }
    imgIndex.forEach(index =>
        imgCorps.push(corps.substring(index, index + 24))
        )

    imgTab.forEach(imgUploaded => {
        var todelete = 1
        for (var i = 0 ; i < imgCorps.length; i++) {
                if(imgCorps[i] == imgUploaded){
                    todelete = 0
                }
            }
            if (todelete>0){
                imgUploadButNotRecorded.push(imgUploaded)
            }
            todelete = 1;
        }
    )

    switch(req.body.typeContenu){
        case 'article':
            conn.db.collection('articles').updateOne({_id: new ObjectId(req.body.id)},{ $set:{
                titre: req.body.titre,
                corps: req.body.corps,
                resume: req.body.resume,
                imgArticle: imgCorps,               
            }
            },function(err, datas){
                if(!err){
                    res.status(201).json({message:'enregistrement ok'})
                } else {
                    console.log(err)
                    res.status(400)
                }
            })
            break;
        case 'evenement':
            var dateDelEvnmt = date.dateIso(req.body.dateEvnmt,req.body.heureEvnmt)

            conn.db.collection('evenements').updateOne({_id: new ObjectId(req.body.id)},{ $set:{
                titre: req.body.titre,
                corps: req.body.corps,
                resume: req.body.resume,
                imgArticle: imgCorps,
                dateEvnmt: dateDelEvnmt,
                adresse: {
                    nVoie: req.body.nVoie,
                    commune: req.body.commune,
                    zip: req.body.zip,
                    description:req.body.description,
                }
            }
            },function(err, datas){
                if(!err){
                    res.status(201).json({message:'enregistrement ok'})
                } else {
                    console.log(err)
                    res.status(400)
                }
            })
            break;
            case 'workshop':
                var dateDelEvnmt = date.dateIso(req.body.dateEvnmt,req.body.heureEvnmt)
    
                conn.db.collection('workshops').updateOne({_id: new ObjectId(req.body.id)},{ $set:{
                    titre: req.body.titre,
                    corps: req.body.corps,
                    resume: req.body.resume,
                    imgArticle: imgCorps,
                    dateEvnmt: dateDelEvnmt,
                    nbrPlace: req.body.nbrPlace,
                    adresse: {
                        nVoie: req.body.nVoie,
                        commune: req.body.commune,
                        zip: req.body.zip,
                        description:req.body.description,
                    }
                }
                },function(err, datas){
                    if(!err){
                        res.status(201).json({message:'enregistrement ok'})
                    } else {
                        console.log(err)
                        res.status(400)
                    }
                })
                break;             
    }
    imgUploadButNotRecorded.forEach(ImgNotrecord => {
        imgFile = pathImg+ImgNotrecord
                    if (fs.existsSync(imgFile)){   
                        fs.unlinkSync(img = imgFile)
                    }else{
                        console.log("l'image n'existe pas")
                    }
    })
    imgTab = []
}

exports.deleteOneArticle = (req,res) => {
    switch(req.body.typeContenu){
        case 'article':
            conn.db.collection('articles').findOne({_id: new ObjectId(req.body.id)},{projection:{imgArticle:1}},function(err, datas){
                datas.imgArticle.forEach(imgToDelete => {
                    imgFile = pathImg+imgToDelete
                    if (fs.existsSync(imgFile)){
                        fs.unlinkSync(img = pathImg+imgToDelete)
                    }else{
                        console.log("l'image n'existe pas")
                    }
                })
                conn.db.collection('articles').deleteOne({_id: new ObjectId(req.body.id)},
                function(err, datas){
                    if(!err){
                        res.status(201).json({message:'enregistrement ok'})
                    } else {
                        console.log(err)
                        res.status(400)
                    }    
                })
            })
            break;
        case 'workshop':
            conn.db.collection('workshops').findOne({_id: new ObjectId(req.body.id)},{projection:{imgArticle:1}},function(err, datas){
                datas.imgArticle.forEach(imgToDelete => {
                    imgFile = pathImg+imgToDelete
                    if (fs.existsSync(imgFile)){
                        fs.unlinkSync(img = pathImg+imgToDelete)
                    }else{
                        console.log("l'image n'existe pas")
                    }
                })
                conn.db.collection('workshops').deleteOne({_id: new ObjectId(req.body.id)},
                function(err, datas){
                    if(!err){
                        res.status(201).json({message:'enregistrement ok'})
                    } else {
                        console.log(err)
                        res.status(400)
                    }  
                })
            });
            break;
        case 'evenement':
            conn.db.collection('evenements').findOne({_id: new ObjectId(req.body.id)},{projection:{imgArticle:1}},function(err, datas){
                datas.imgArticle.forEach(imgToDelete => {
                    imgFile = pathImg+imgToDelete
                    if (fs.existsSync(imgFile)){
                        fs.unlinkSync(img = pathImg+imgToDelete)
                    }else{
                        console.log("l'image n'existe pas")
                    }
                })
                conn.db.collection('evenements').deleteOne({_id: new ObjectId(req.body.id)},
                function(err, datas){
                    if(!err){
                        res.status(201).json({message:'enregistrement ok'})
                    } else {
                        console.log(err)
                        res.status(400)
                    }                      
                })
            });
            break
    }
}

exports.updateOnlyPlaceWorkshop = (req,res) => {
    conn.db.collection('workshops').updateOne({_id: new ObjectId(req.body.id)},{$set: { placeRestante: req.body.placeRestante }},function(err,datas){
        if(!err){
            res.status(201).json({message:'enregistrement ok'})
        } else {
            console.log(err)
            res.status(400)
        }
    })
}