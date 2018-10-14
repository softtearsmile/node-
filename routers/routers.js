const Router = require('koa-router');
const user = require('../control/user');
const article = require('../control/article');
const comment = require('../control/comment');
const admin = require('../control/admin');
const upload = require('../util/upload');

const router = new Router();

//获取所有文章列表
router.get('/', article.getList);

//获取当前文章详细内容
router.get('/details', article.details);

//保持用户登入
router.get('/user', async (ctx, next) => {
    // console.log(ctx.session)
    // console.log(ctx.session.isNew)
    // console.log(ctx.cookies.get('username'))
    if (ctx.session.isNew) { //没有session
        if (ctx.cookies.get('username')) {
            ctx.session = {
                username: ctx.cookies.get('username'),
                uid: ctx.cookies.get('uid'),
            }
        }
    }
    ctx.body = {
        session: ctx.session.isNew,
        username: ctx.session.username,
        uid: ctx.session.uid,
        role: ctx.session.role
    }
});

//用户登入
router.post('/user/login', user.login);

//用户注册
router.post('/user/reg', user.reg);

//用户退出
router.get('/user/logout', user.logout);

//文章发表
router.post('/article', user.keepLogin, article.publish);

//文章发表页面
// router.get('/article', user.keepLogin, article.addPage);

//文章列表分页
// router.get('/page/:id', user.keepLogin, article.getList);

//文章详情页
// router.get('/article/:id', user.keepLogin, article.details);

//发表评论
router.post('/comment', user.keepLogin, comment.save);

//个人中心
// router.get('/admin/:id', user.keepLogin, admin.index);

//头像上传
router.post('/upload', user.keepLogin, upload.single('file'), user.upload);

//获取所有用户
router.get('/user/users', user.keepLogin, user.userList);

//获取当前用户所有评论
router.get('/user/comments', user.keepLogin, comment.comlist);

//获取当前用户所有文章
router.get('/user/articles', user.keepLogin, article.currentList);

//删除用户
router.delete('/user/delete', user.keepLogin, user.del);

//删除当前用户评论
router.delete('/comment/:id', user.keepLogin, comment.del);

//删除当前用户文章
router.delete('/article/delete', user.keepLogin, article.del);


//404
router.get('*', async ctx => {

    return await ctx.render('404', {title: 404})
});

module.exports = router;