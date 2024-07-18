const {User, Profile, Post, Hashtag, PostHashtag} = require('../models/index')
const createdDate = require('../helper/createdDate')


class Controller {
    
    static async homePage(req,res) {
        try {
            const {userId} = req.session
            let posts = await Post.findAll({
                include:{
                    model: User,
                    include:{
                        model:Profile
                    }
                },
                order: [['createdAt', 'DESC']]
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
            const { userId } = req.session
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

        //   let findUser = await User.findOne({
        //     include:Profile,
        //     where:{id}
        //   })  
        //   console.log(findUser);
           res.render('profileForm', {id}) 
        } catch (error) {
            res.send(error.message)
        }
    }

    static async postProfile(req,res){
        try {
            const {id} = req.params
            const {fullName, bio, location, avatarUrl} = req.body

          let userProfile = await Profile.findOne({where: {UserId: id}})

          await userProfile.update({
            fullName,
            bio,
            location,
            avatarUrl
          })

          
          res.redirect('/')
        //   console.log(findUser);
        } catch (error) {
            console.log(error);
           res.send(error.message) 
        }
    }

    static async editProfile(req,res) {
        try {

            const {id} = req.params
            let profile = await Profile.findByPk(id)

            // console.log(profile);
            // console.log(id);
            res.render('profileFormEdit',{profile})

        } catch (error) {
            res.send(error)
        }
    }

    static async postEditProfile(req,res){
        try {
            const{id} = req.params
            const{avatarUrl, fullName,bio, location} = req.body

            let userProfile = await Profile.findOne({where: {UserId: id}})
            await userProfile.update({
                avatarUrl,
                fullName,
                bio,
                location
              })
            // console.log(data);
            res.redirect('/')
        } catch (error) {
            res.send(error.message)
        }
    }
}

module.exports = Controller