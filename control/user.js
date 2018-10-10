const User = require('../models/user');
const encryto = require('../util/encrypto');


//用户注册
exports.reg = async ctx => {
    const user = ctx.request.body;
    const username = user.username;
    const password = user.password;

    //查询数据库 是否重合用户名
    await new Promise((resolve,reject) => {
        //user数据库查询
        User.find({username},(err,data) => {
            if (err){return reject(err)}
            if (data.length !== 0){
                //用户名已存在
                console.log(data);
                return resolve("")
            }

            //用户名不存在 存入数据库 自定义加密密码
            const _user = new User({
                username,
                password : encryto(password),
                articleNum : 0,
                commentNum : 0,
            });
            _user.save((err,data) => {
                if (err){
                    reject(err)
                }else {
                    resolve(data)
                }
            })
        })
    }).then(async data => {
        if (data){//注册成功
            await ctx.render('isok',{status : "注册成功"})
        } else {//用户名已存在
            await ctx.render('isok',{status : "用户名已存在"})
        }
    }).catch(async err => {
        //注册失败
        await ctx.render('isok',{status : "注册失败"})
    })
};

//用户登入
exports.login =  ctx => {
    const user = ctx.request.body;
    const username = user.username;
    const password = user.password;
    console.log(user,username,password)
    ctx.body = {
        msg : '返回的数据',
        status : false
    }
    /*
    await new Promise((resolve,reject) => {
        //user数据库查询
        User.find({username},(err,data) => {
            if (err){return reject(err)}
            if (data.length ===0){
                //用户不存在
                return reject("用户不存在")
            }

            //匹配密码
            if (data[0].password === encryto(password)){
                //匹配成功
                resolve(data)
            }else {
                //匹配失败
                resolve("")
            }
        })
    })
        .then(async data => {
            if (data){
                //让用户在其 cookie 里设置 username
                ctx.cookies.set("username", username, {
                    domain: "localhost",
                    path: '/',
                    maxAge: 36e5,
                    httpOnly: true,
                    overwrite: false,
                });

                ctx.cookies.set('uid', data[0]._id, {
                    domain: "localhost",
                    path: '/',
                    maxAge: 36e5,
                    httpOnly: true,
                    overwrite: false,
                });

                ctx.session = { //后台保存便于比对
                    username,
                    uid : data[0]._id,
                    avatar : data[0].avatar,
                    role : data[0].role,
                };

                await ctx.render('isok',{status : "登入成功"})
            }else {
                await ctx.render('isok',{status : "密码错误"})
            }
        })
        .catch(async err => {
            if (err === "用户不存在"){
                await ctx.render('isok',{status : "用户不存在"})
            }else {
                await ctx.render('isok',{status : "登入失败"})
            }
        })
        */
};

//保持用户的状态
exports.keepLogin = async (ctx,next) => { //一般为第一个中间键
    if(ctx.session.isNew){ //没有session
        if (ctx.cookies.get('username')) {
            ctx.session = {
                username : ctx.cookies.get('username'),
                uid :ctx.cookies.get('uid'),
            }
        }
    }
    await next()
};

//用户退出
exports.logout = async ctx => {
    ctx.session = null;
    ctx.cookies.set("username",null,{maxAge:0});
    ctx.cookies.set("uid",null,{maxAge:0});

    //在后台重定向到 根
    ctx.redirect('/');
};

//获取用户
exports.userlist = async ctx => {
    const data = await User
        .find()
        .then(data => data)
        .catch(err => console.log(err));

    ctx.body = {
        code: 0,
        count: data.length,
        data
    };
};

//上传用户头像
exports.upload = async ctx => {

    const filename = ctx.req.file.filename;
    let data = {
        status : 1,
        message : "上传成功"
    };

    await User.updateOne({_id:ctx.session.uid},{$set:{avatar: "/avatar/"+filename}},(err,res) => {
        if (err) {
            return data = {
            status : 0,
            message : "上传失败"
        }}else {
            ctx.session.avatar = "/avatar/"+filename;
        }
    });

    ctx.body = data
};

//删除用户
exports.del = async ctx => {
    const userId = ctx.params.id;
    console.log(userId);
    let res = {
        state: 1,
        message: "删除成功",
    };

    await User
        .findById(userId)
        .then(data => data.remove())
        .catch(err => {
            res = {
                state: 0,
                message: err,
            }
        });

    ctx.body = res
};