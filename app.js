const koa = require('koa')
const router = require('./routers/routers')
const body = require('koa-body')
const session = require('koa-session')
const cors = require('@koa/cors')

const app = new koa()

//配置session
app.keys = ["我只是个签名"];
const CONFIG = {
    key : "Sid", //方便查找 (改)
    maxAge : 36e5, //保存的时间ms (改)
    overwrite : true, //是覆盖
    httpOnly: true, //不能让客户端访问这个coookie
    signed : true, //能签名
    rolling : true //记录最后一次操作保存
};

//注册session
app.use(session(CONFIG,app));

//配置koa-body 处理 post请求数据
app.use(body());

//解决跨域问题
app.use(cors())

//注册路由信息
app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(8001);