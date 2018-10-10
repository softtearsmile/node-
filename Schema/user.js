const {Schema} = require('./config');

const UserSchema = new Schema({
    username : String,
    password : String,
    role : {
        type: Number,
        default: 1,
    },
    avatar : {
        type : String,
        default : "/avatar/default.jpg" //默认值
    },
    articleNum : Number,
    commentNum : Number,
},{versionKey:false});

//设置 user 钩子
UserSchema.post('remove',doc => {
    const Article = require('../models/article');
    const Comment = require('../models/comment');

    const {_id:userId} = doc;

    //查找并迭代删除文章
    Article
        .find({author:userId})
        .then(data => {
            data.forEach(v => v.remove())
        });

    //查找并迭代删除评论
    Comment
        .find({from:userId})
        .then(data => {
            data.forEach(v => v.remove())
        });
});

module.exports = UserSchema;