const Router = require('koa-router');
const user = require('../control/user');
// const article = require('../control/article');
// const comment = require('../control/comment');
// const admin = require('../control/admin');
// const upload = require('../util/upload');

const router = new Router();
/*
//设计主页
router.get('/',user.keepLogin,article.getList);

//动态路由 主要用来处理 用户登入 注册 退出
router.get(/^\/user\/(?=reg|login)/,async(ctx) => {
    const show = /reg$/.test(ctx.path);
    await ctx.render('register',{
        show
    })
});

//用户登入
router.post('/user/login', user.login );

//用户注册
router.post('/user/reg', user.reg );

//用户退出
router.get('/user/logout', user.logout);

//文章发表页面
router.get('/article',user.keepLogin,article.addPage);

//文章发表
router.post('/article',user.keepLogin,article.add);

//文章列表分页
router.get('/page/:id',user.keepLogin,article.getList);

//文章详情页
router.get('/article/:id',user.keepLogin,article.details);

//发表评论
router.post('/comment',user.keepLogin,comment.save);

//个人中心
router.get('/admin/:id',user.keepLogin,admin.index);

//头像上传
router.post('/upload',user.keepLogin,upload.single('file'),user.upload);

//获取所有用户
router.get('/user/users',user.keepLogin,user.userlist);

//获取当前用户所有评论
router.get('/user/comments',user.keepLogin,comment.comlist);

//获取当前用户所有文章
router.get('/user/articles',user.keepLogin,article.artlist);

//删除用户
router.delete('/user/:id',user.keepLogin,user.del);

//删除当前用户评论
router.delete('/comment/:id',user.keepLogin,comment.del);

//删除当前用户文章
router.delete('/article/:id',user.keepLogin,article.del);






//404
router.get('*',async ctx => {

    return await ctx.render('404',{title: 404})
});
*/
module.exports = router;