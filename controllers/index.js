const {User, Profile, Post, Hashtag, PostHashtag} = require('../models/index')
const createdDate = require('../helper/createdDate')


class Controller {
    
    static async homePage(req,res) {
        try {
            const {userId} = req.session.user
            let posts = await Post.findAll({
                include:{
                    model: User,
                    include:{
                        model:Profile
                    }
                }
            })

           let data =  posts.map(post=> {
            return {
                id: post.id,
                avatar:post.User.Profile.avatarUrl,
                name:post.User.Profile.fullName,
                content:post.content,
                image:post.image,
                published: createdDate(post.createdAt)
            }
           })

            // console.log(data);
            res.render('home',{data, userId})
        } catch (error) {

            res.send(error.message)
        }
    }

    static async addNewPost(req,res){
        try {
            const { userId } = req.session.user
            const {content} = req.body

            await Post.create({content, userId })

            res.redirect('/')
        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }

    static async getProfile(req,res){
        try {
            const {id} = req.params

          let findUser = await User.findOne({
            include:Profile,
            where:{id}
          })  
          console.log(findUser);
           res.render('profile') 
        } catch (error) {
            res.send(error.message)
        }
    }

    static async postProfile(req,res){
        try {
            const {id} = req.session.user

          let findUser = await User.findByPk(id)  
          console.log(findUser);
        } catch (error) {
           res.send(error) 
        }
    }
}

module.exports = Controller