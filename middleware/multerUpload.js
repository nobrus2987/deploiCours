const multer = require('multer');
const path = require('path')

// Configuration de Multer pour l'upload d'images
const storageImgArticle = multer.diskStorage({
    destination: (req,file,cb) => { console.log(file)
        imgFolder = path.join(__dirname,'../','../','frontend/apogee/public/imgArticles');
        cb(null,imgFolder)
    },
    filename: (req,file,cb) => {
        nameImg= 'imgArt-' + Date.now()+ path.extname(file.originalname);
        cb(null, nameImg);
    }
  })
  exports.uploadOneFile = multer({ storage: storageImgArticle})

  const storageGalerie = multer.diskStorage({
    destination: (req,file,cb) => {
        imgFolder = path.join(__dirname,'../','../','frontend/apogee/public/imgGaleries');
        cb(null,imgFolder)
    },
    filename: (req,file,cb) => {
        nameImg= 'imgGal-' + Date.now()+ path.extname(file.originalname);
        cb(null, nameImg);
    }
  })
  exports.uploadGalerie = multer({ storage: storageGalerie})
  