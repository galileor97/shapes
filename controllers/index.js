const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require('../r2config');
const { User, Profile, Post, Hashtag, PostHashtag } = require('../models/index');
const createdDate = require('../helper/createdDate');


class Controller {
    
    static async homePage(req,res) {
        try {
            let hashtags = await Hashtag.findAll()
            
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

            let data = posts.map(post => {
                return {
                    id: post.id,
                    avatar: post.User.Profile.avatarUrl,
                    name: post.User.Profile.fullName,
                    content: post.content,
                    imageUrl: post.image,  
                    published: createdDate(post.createdAt)
                }
            });

            // console.log(data);
            res.render('home',{data, userId})
        } catch (error) {
            res.send(error.message)
        }
    }

    static async addNewPost(req, res) {
        try {
            const { userId } = req.session;
            const { content } = req.body;
            let image = null;
    
            if (req.file) {
                const fileName = `${Date.now()}-${encodeURIComponent(req.file.originalname)}`;
                const params = {
                    Bucket: process.env.R2_BUCKET_NAME,
                    Key: fileName,
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype,
                };
    
                const command = new PutObjectCommand(params);
                await s3Client.send(command);
    

                image = `https://gallery.galileor.xyz/${fileName}`;
            }
    
            const newPost = await Post.create({ content, userId, image });
            console.log('New post:', newPost);
    
            res.redirect('/');
        } catch (error) {
            console.error('Error in addNewPost:', error);
            res.status(500).send(error.message);
        }
    }

    static async getProfile(req, res) {
        try {
            const { id } = req.params;
    
            let user = await User.findByPk(id, {
                include: Profile
            });
            
            // console.log(user);
            const accountAge = user.getAccountAge();
    
            
            const posts = await Post.findAll({
                where: { userId: id },
                order: [['createdAt', 'DESC']]
            });
    
            const formattedPosts = posts.map(post => ({
                id: post.id,
                content: post.content,
                image: post.image,
                published: createdDate(post.createdAt)
            }));
    
            console.log(formattedPosts);
            
            res.render('profileForm', { 
                id, 
                user,
                profile: user.Profile,
                posts:formattedPosts,
                accountAge
            });
        } catch (error) {
            res.send(error.message);
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

            res.redirect('/')
        } catch (error) {
            res.send(error.message)
        }
    }
}

module.exports = Controller