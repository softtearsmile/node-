const {Schema} = require('./config');
const ObjectId = Schema.Types.ObjectId;

//内容 评论人(用户名 头像)
const CommentSchema = new Schema({
    content : String,
    from : {
        type : ObjectId,
        ref : "users"
    },
    article : {
        type : ObjectId,
        ref : "articles"
    },
},{
    versionKey : false,
    timestamps : {
        createdAt : "created"
    }
});
CommentSchema.post('remove',doc => {
    const User = require('../models/user');
    const Article = require('../models/article');

    const {from,article} = doc;

    //删除对应文章评论数-1
    Article.updateOne({_id:article},{$inc: {commentNum:-1}}).exec();

    //删除对应用户评论数-1
    User.updateOne({_id:from},{$inc: {commentNum:-1}}).exec();
});
module.exports = CommentSchema;