const path = require('path')
const fs = require('fs');
const conn = require('./connectDb')

const pathImg = path.join(__dirname,'../','../','frontend/apogee/public/imgGaleries/');



exports.recordGalerie = (req,res) => {
    var imgToRecorde = [];
    console.log(req.body.titre)
    req.files.forEach(element => {
        imgToRecorde.push(element.filename)
    });
    console.log(imgToRecorde)
    conn.db.collection('galerie').insertOne({
        titre: req.body.titre,
        images: imgToRecorde
    }, function (err,record){
        if (!err) {res.status(201).json({message: 'Enregistrement OK'})}
        else {res.status(400).json({ error })}
    })
}

exports.deleteImgGalerie = (req,res) => {
    fs.unlinkSync(pathImg+imgToRecorde[req.body.index])
    imgToRecorde.splice(req.body.index,1)  //splice(a,n) = retire n éléments à partir de l'index a
    console.log(imgToRecorde)
}