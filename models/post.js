'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, { foreignKey: 'userId' });
      Post.belongsToMany(models.Hashtag, { 
        through: 'PostHashtag',  // This is the name of the junction table
        foreignKey: 'postId',
        otherKey: 'hashtagId'
      });
    
    }
  }
  Post.init({
    content: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    image: DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};