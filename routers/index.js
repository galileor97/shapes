const router = require('express').Router();
const Controller = require('../controllers');
const User = require('../controllers/UserController');


//auth
router.get("/signup", User.signUp);
router.post("/signup", User.postSignUp);
router.get('/signin', User.signIn)
router.post('/signin', User.postSignIn)
router.use((req, res, next) => {
    console.log('====================================');
    console.log(req.session.user);
    console.log('====================================');
    if (!req.session.user.userId) {
        const error = 'you have to sign in'
        res.redirect(`/signin?error=${error}`)
    }else{
        next()
    }
});
router.get('/logout',User.logout) 
router.get('/', Controller.homePage)

router.post('/', Controller.addNewPost)
router.get('/signup', User.signUp)
router.post('/signup', User.postSignUp)





module.exports = router;