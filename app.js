const koa = require('koa')
const router = require('./routers/routers')
const body = require('koa-body')
const cors = require('@koa/cors')

const app = new koa()

//配置koa-body 处理 post请求数据
app.use(body());

//解决跨域问题
app.use(cors())

//注册路由信息
app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(8001);