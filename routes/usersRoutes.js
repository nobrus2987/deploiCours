const express = require('express');
const usersCtrl = require('../controllers/usersCtrl');

const router = express.Router();

router.post('/connexion', usersCtrl.connexion)
router.get('/getAllArticles', usersCtrl.getAllArticles)
router.get('/getOneArticle/:id', usersCtrl.getOneArticle)
router.get('/getsixLastArticles',usersCtrl.getsixLastArticles)
router.get('/getFutureEvent',usersCtrl.getFutureEvent)
router.get('/getAllEvenements',usersCtrl.getAllEvenements)
router.get('/getOneEvenement/:id',usersCtrl.getOneEvenement)
router.get('/getAllWorkshops',usersCtrl.getAllWorkshops)
router.get('/getOneWorkshop/:id',usersCtrl.getOneWorkshop)
router.get('/getListeAlbums',usersCtrl.getListeAlbums)
router.get('/getOneAlbum/:id',usersCtrl.getOneAlbum)

module.exports = router;