const path = require('path')
const conn = require('./connectDb')
const date = require('./formatDate')  
var ObjectId = require('mongodb').ObjectID;
const { DateTime } = require("luxon");

const fs = require('fs');

const pathImg = path.join(__dirname,'../','../','frontend/apogee/public/imgArticles/');

var imgTab = [];

exports.saveArticleImg = (req,res) => {
    res.json({location: '../imgArticles/'+ nameImg })
    imgTab.push(nameImg)
}

var imgTab = [];

exports.deleteImg = (req,res) => {
    imgTab.forEach(images =>
    fs.unlinkSync(ImgToDelete = pathImg+images),
    imgTab = [],
    )    
}

exports.recordArticle = (req,res) => {
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
    imgUploadButNotRecorded.forEach(ImgNotrecord => {
        imgFile = pathImg+ImgNotrecord
        if (fs.existsSync(imgFile)){   
            fs.unlinkSync(img = imgFile) 
        }else{
            console.log("l'image n'existe pas")
        }
    })

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


