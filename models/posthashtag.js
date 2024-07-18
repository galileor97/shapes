'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostHashtag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PostHashtag.belongsTo(models.Post)
      PostHashtag.belongsTo(models.Hashtag)
    }
  }
  PostHashtag.init({
    postId: DataTypes.INTEGER,
    hashtagId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PostHashtag',
  });
  return PostHashtag;
};