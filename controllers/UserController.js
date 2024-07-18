const { User } = require('../models/user')
class UserController{

static async signIn(req,res){
    try {
        res.render('signin')
    } catch (error) {
        res.send(error)
    }
}

static async signUp(req,res){
    try {
        res.render('signup')
    } catch (error) {
        res.send(error)
    }
}
static async postSignUp(req,res){
    try {
        console.log(req.body);
        const{username,email,password} = req.body
        await User.create({ username, email, password });
        res.redirect('/')
    } catch (error) {
        res.send(error.message)
    }
}

}

module.exports = UserController