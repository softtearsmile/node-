const koa = require('koa')
const router = require('./routers/routers')
const body = require('koa-body')
const session = require('koa-session')
const cors = require('@koa/cors')
const { join } = require('path');

const app = new koa()

//配置session
app.keys = ["我只是个签名"];
const CONFIG = {
    key: "Sid", //方便查找 (改)
    maxAge: 36e5, //保存的时间ms (改)
    overwrite: true, //是覆盖
    httpOnly: true, //不能让客户端访问这个coookie
    signed: true, //能签名
    rolling: true //记录最后一次操作保存
};

//注册session
app.use(session(CONFIG, app));

//配置koa-body 处理 post请求数据
app.use(body({
    multipart: true,
    formidable: {
        // 上传存放的路径
        uploadDir: join(__dirname, "images/avatar/"),
        // 保持后缀不变
        keepExtensions: true,
        // 文件大小
        maxFileSize: 61704,
        onFileBegin: (name, file) => {
            // 取后缀  如：.js  .txt
            const reg = /\.[A-Za-z]+$/g
            const ext = file.name.match(reg)[0]
            // 修改上传文件名
            file.path = join(__dirname, "images/avatar/") + Date.now() + ext
            file.name = Date.now() + ext
        },
        onError(err){
            console.log(err)
        }
    }
}));

//解决跨域问题
// let whiteList = ['localhost:8080']
// app.use(async (ctx, next) => {
//     console.log(1)
//     if (ctx.request.header.origin !== ctx.origin && whiteList.includes(ctx.request.header.origin)) {
//         ctx.set('Access-Control-Allow-Origin', ctx.request.header.origin);
//         ctx.set('Access-Control-Allow-Credentials', true);
//     }
//     if (ctx.method === 'OPTIONS') {
//         console.log(2)
//         ctx.set('Access-Control-Allow-Methods', 'PUT,DELETE,POST,GET');
//         ctx.set('Access-Control-Max-Age', 3600 * 24);
//         ctx.body = '';
//     }
//     await next();
// });
// http://106.14.145.207
// http://localhost:8080
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', 'http://localhost:8080'); //不能为*
    ctx.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    ctx.set("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    ctx.set("Content-Type", "application/json;charset=utf-8");
    ctx.set('Access-Control-Allow-Credentials', true);
    await next();
});

//生成超级管理员
{
    const {db} = require('./Schema/config');
    const UserSchema = require('./Schema/user');
    const encryto = require('./util/encrypto');
    const User = db.model("users", UserSchema);

    //查找是否已有超级管理
    User
        .find({username: "admin"})
        .then((data) => {
            if (data.length === 0) {
                //创建超级管理员
                new User({
                    username: "admin",
                    password: encryto("admin"),
                    role: 666,
                    articleNum: 0,
                    commentNum: 0,
                }).save((err, data) => {
                    if (err) {
                        return console.log(err)
                    }
                    console.log("超级管理员账号;admin,超级管理员密码;admin")
                })
            } else {
                //已有超级管理员
                console.log("超级管理员账号;admin,超级管理员密码;admin")
            }
        }).catch(err => console.log(err))
}

//注册路由信息
app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(8000);