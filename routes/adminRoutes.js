const express = require('express');

const newArticleCtrl = require('../controllers/newArticleCtrl');
const usersCtrl = require('../controllers/usersCtrl');
const galerieCtrl = require('../controllers/galerieCtrl');

// importation du middleware d'authentification à appliquer à toutes les routes admin
const auth = require('../middleware/auth');

const upload = require('../middleware/multerUpload')

const router = express.Router();

router.post('/inscription',auth, usersCtrl.inscription);
router.post('/connexion', usersCtrl.connexion)
router.post('/articles/uploadImg', upload.uploadOneFile.single('file'),newArticleCtrl.saveArticleImg);
router.post('/articles/recordArticle',auth, newArticleCtrl.recordArticle);
router.post('/articles/updateArticle',auth, newArticleCtrl.updateArticle);
router.post('/articles/updateOnlyPlaceWorkshop',auth, newArticleCtrl.updateOnlyPlaceWorkshop);
router.post('/articles/deleteOneArticle',auth, newArticleCtrl.deleteOneArticle);
router.post('/articles/deleteArticleImg', newArticleCtrl.deleteImg);
router.post('/galerie/recordGalerie', auth,upload.uploadGalerie.array('file'),galerieCtrl.recordGalerie);
router.post('/galerie/deleteImgNewGalerie', galerieCtrl.deleteImgGalerie);
router.get('/getAllContentListe', auth,usersCtrl.getAllContentListe);

module.exports = router;