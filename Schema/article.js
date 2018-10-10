const {Schema} = require('./config');
const ObjectId = Schema.Types.ObjectId;
const ArticleSchema = new Schema({
    title : String,
    content : String,
    tips : String,
    commentNum : Number,
    author : {
        type : ObjectId,
        ref : "users"
    },
},{
    versionKey : false,
    timestamps : {
        createdAt : "created"
    }
});

//设置article 钩子
ArticleSchema.post('remove',doc => {
    const User = require('../models/user');
    const Comment = require('../models/comment');

    const {_id:articleId,author:authorId} = doc;

    //删除对应用户文章数-1
    User.updateOne({_id : authorId},{$inc:{articleNum:-1}}).exec();

    //查找并迭代删除评论
    Comment
        .find({article:articleId})
        .then(data => {
            data.forEach(v => v.remove())
        })
});

module.exports = ArticleSchema;