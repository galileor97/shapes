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

           let data =  posts.map(post=>({
                avatar:post.User.Profile.avatarUrl,
                name:post.User.Profile.fullName,
                content:post.content,
                image:post.image,
                published: createdDate(post.createdAt)


            }))

            console.log(data);
            res.render('home',{data})
        } catch (error) {
            res.send(error.message)
        }
    }

    static async addNewPost(req,res){
        try {
            // console.log(req.s, "====");
            const {content} = req.body
            await Post.create({content})
            res.redirect('/')
        } catch (error) {
            res.send(error.message)
        }
    }


}

module.exports = Controller