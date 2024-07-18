const {User, Profile, Post, Hashtag, PostHashtag} = require('../models/index')
const createdDate = require('../helper/createdDate')


class Controller {
    
    static async homePage(req,res) {
        try {
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
                avatar:post.User.Profile.avatarUrl,
                name:post.User.Profile.fullName,
                content:post.content,
                image:post.image,
                published: createdDate(post.createdAt)
            }
           })

            console.log(data);
            res.render('home',{data})
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
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


}

module.exports = Controller