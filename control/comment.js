const User = require('../models/user');
const Article = require('../models/article');
const Comment = require('../models/comment');


//发表评论
exports.save = async ctx => {
    let message = {
        status: 0,
        msg : "用户未登录"
    };

    //用户未登录
    if (ctx.session.isNew) {return ctx.body = message}

    //用户已登录

    //获取数据
    const data = ctx.request.body;
    data.from = ctx.session.uid;



    //保存评论到库
    await new Comment(data)
        .save()
        .then(data => {
            message = {
                status: 1,
                msg : "评论成功"
            };
            Article
                .updateOne({_id : data.article},{$inc:{commentNum:1}},err => {
                    if (err){return console.log(err)}
                });
            User
                .updateOne({_id : data.from},{$inc:{commentNum:1}},err => {
                    if (err){return console.log(err)}
                });
        })
        .catch(err => {
            message = {
                status: 0,
                msg : err
            }
        });

    ctx.body = message
};

//获取当前用户所有评论
exports.comlist = async ctx => {
    const uid =ctx.session.uid;

    const data = await Comment
        .find({from: uid})
        .populate('article', 'title')
        .then(data => data)
        .catch(err => console.log(err));

    ctx.body = {
        code: 0,
        count: data.length,
        data
    };
};

//删除评论
exports.del = async ctx => {
    const commentId = ctx.params.id;

    let res = {
        state: 1,
        message: "删除成功",
    };

    await Comment
        .findById(commentId)
        .then(data => data.remove())
        .catch(err => {
            res = {
                state: 0,
                message: err,
            }
        });

    ctx.body = res
};