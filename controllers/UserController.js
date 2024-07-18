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
      console.log(req.body);
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
      const { username, password } = req.body;
      
      let user = await User.findOne({ where: { username } });
  
      if (!user) {
        return res.redirect('/signin?error=' + encodeURIComponent('Invalid username/password'));
      }
  
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.redirect('/signin?error=' + encodeURIComponent('Invalid password'));
      }
  

      req.session.userId = user.id;
      req.session.role = user.role;
  

      req.session.save(async (err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).send('Error saving session');
        }
  
        let profileData = await Profile.findOne({ where: { UserId: user.id } });
  
        if (!profileData || !profileData.fullName) {
          res.redirect(`/profile/${user.id}`);
        } else {
          res.redirect('/');
        }
      });
  
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).send('An error occurred during login');
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