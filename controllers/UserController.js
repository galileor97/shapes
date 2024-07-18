const  bcrypt  = require('bcryptjs')
const { User, Profile } = require('../models/index');
class UserController {
  static async signIn(req, res) {
    try {
      const{error} = req.query
      res.render("signin",{error});
    } catch (error) {
      res.send(error);
    }
  }

  static async signUp(req, res) {
    try {
      res.render("signup");
    } catch (error) {
      res.send(error);
    }
  }
  static async postSignUp(req, res) {
    try {
      // console.log(req.body);
      const { username, email, password } = req.body;
      const new_user = await User.create({ username, email, password });
      await Profile.create({ UserId: new_user.id })

      res.redirect("/signin");
    } catch (error) {
      res.send(error.message);
    }
  }
  static async postSignIn(req, res) {
    try {
    //   console.log(req.body);
      const { username, password } = req.body;
      // console.log(req.body);
      let data = await User.findOne({ where: {username} })
      // console.log( data);
      if (data) {
        const isValidPassword = await bcrypt.compare(password, data.password);
        if (isValidPassword) {
            req.session.user = {
                userId: data.id,
                role: data.role
            } 
          res.redirect("/");
        } else {
          const error = "invalid password";
          res.redirect(`/signin?error=${error}`);
        }
      } else {
        const error = "invalid username/password";
        res.redirect(`/signin?error=${error}`);
      }
    } catch (error) {
        // console.log(error);
      res.send(error.message);
    }
  }
  static async logout(req,res){
    try {
      await req.session.destroy()
      res.redirect('/signin')
    } catch (error) {
      res.send(error.message)
    } 
  }
}

module.exports = UserController