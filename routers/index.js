const router = require('express').Router();
const Controller = require('../controllers');
const User = require('../controllers/UserController');


//auth
router.get("/signup", User.signUp);
router.post("/signup", User.postSignUp);
router.get('/signin', User.signIn)
router.post('/signin', User.postSignIn)
router.use((req, res, next) => {
    if (!req.session.userId) {
        const error = 'you have to sign in'
        res.redirect(`/signin?error=${error}`)
    }else{
        next()
    }
});
router.get('/logout',User.logout) 
router.get('/', Controller.homePage)
   


module.exports = router;