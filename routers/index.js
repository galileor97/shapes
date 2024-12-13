const router = require('express').Router();
const Controller = require('../controllers');
const User = require('../controllers/UserController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

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

   

router.get('/profile/:id', Controller.getProfile)
router.post('/profile/:id', Controller.postProfile)
router.get('/profile/:id/edit', Controller.editProfile)
router.post('/profile/:id/edit', Controller.postEditProfile)

router.post('/',upload.single('postImage'), Controller.addNewPost)
router.get('/signup', User.signUp)
router.post('/signup', User.postSignUp)






module.exports = router;