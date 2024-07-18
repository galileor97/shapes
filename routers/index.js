const router = require('express').Router();
const Controller = require('../controllers');
const User = require('../controllers/UserController');


//auth
router.get('/signin', User.signIn)
router.get('/', Controller.homePage)
router.get('/signup', User.signUp)
router.post('/signup', User.postSignUp)



router.get('/', Controller.homePage)


module.exports = router;