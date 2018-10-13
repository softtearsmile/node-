const User = require('../models/user');
const Article = require('../models/article');
const Comment = require('../models/comment');

//文章发表页
exports.addPage = async ctx => {
    await ctx.render("add-article",{
        title : "假装正经的文章发表页",
        session : ctx.session
    })
};

//文章发表(存到数据库)
exports.publish = async ctx => {
    //用户已登录(前端已经设置)
    //文章数据
    const data = ctx.request.body;
    data.author = ctx.session.uid;
    data.commentNum = 0;

    //存到数据库
    await new Promise((resolve,reject) => {
        new Article(data)
            .save((err,data) => {
            if (err){return reject(err)}
            resolve(data)
        })
    })
        .then(data => {
            ctx.body = {
                msg : "发表成功",
                status : 1,
            };
            User
                .updateOne({_id : data.author},{$inc:{articleNum:1}},err => {
                    if (err){return console.log(err)}
                })
        })
        .catch(err => {
            ctx.body = {
                msg : "发表失败",
                status : 0,
            }
        })
};

//获取文章列表
exports.getList = async ctx => {

    let page = ctx.params.id || 1;
    page--;

    //获取最大文章数
    // const maxNum = await Article.estimatedDocumentCount((err, num) => {
    //     err ? console.log(err) : num;
    // });

    // .skip(5 * page) //每页2条
    // .limit(5) //只读取2条
    //拿到列表数据
    const articleList = await Article
        .find()
        .sort('-created') //降序
        .populate({
            path: 'author',
            select: '_id username avatar'
        })
        .then(data => data)
        .catch(err => console.log(err));
    ctx.body = {
        articleList,
    }
};

//文章详情
exports.details =async  ctx => {
    const _id =ctx.params.id;

    //查找文章数据
    const article = await Article
        .findById(_id)
        .populate("author","username")
        .then(data => data)
        .catch(err => console.log(err));

    //查找当前文章所有评论
    const comment = await Comment
        .find({article : _id})
        .populate("from","username avatar")
        .then(data => data)
        .catch(err => console.log(err));

    await ctx.render("article",{
        title : article.title,
        article,
        session : ctx.session,
        comment,
    })

};

//获取当前用户所有评论
exports.artlist = async ctx => {
    const uid =ctx.session.uid;

    const data = await Article
        .find({author: uid})
        .then(data => data)
        .catch(err => console.log(err));

    ctx.body = {
        code: 0,
        count: data.length,
        data
    };
};

//获取当前用户的文章列表
exports.currentList = async ctx => {
    let uid = ctx.session.uid
    const articleList = await Article
        .find({author:uid})
        // .populate({
        //     path: 'author',
        //     select: '_id username avatar'
        // })
        .then(data => data)
        .catch(err => console.log(err));
    ctx.body = {
        articleList,
    }
}

//删除文章
exports.del = async ctx => {
    console.log(ctx.query.uid)
    let uid = ctx.query.uid
    let res = {
        status: 1,
        msg: "删除成功",
    };
    await Article
        .findById(uid)
        .then(data => data.remove())
        .catch(err => {
            res = {
                status: 0,
                msg: err,
            }
        });

    ctx.body = res
};