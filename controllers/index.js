const {User, Profile, Post, Hashtag, PostHashtag} = require('../models/index')

class Controller {

    static async homePage(req,res) {
        try {
            res.render('home')
        } catch (error) {
            res.send(error)
        }
    }


}

module.exports = Controller