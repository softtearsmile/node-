const User = require('../models/user');
const encryto = require('../util/encrypto');


//用户注册
exports.reg = async ctx => {
    const user = ctx.request.body;
    const username = user.username;
    const password = user.password;

    //查询数据库 是否重合用户名
    await new Promise((resolve, reject) => {
        //user数据库查询
        User.find({username}, (err, data) => {
            if (err) {
                return reject(err)
            }
            if (data.length !== 0) {
                //用户名已存在
                console.log(data);
                return resolve("")
            }

            //用户名不存在 存入数据库 自定义加密密码
            const _user = new User({
                username,
                password: encryto(password),
                articleNum: 0,
                commentNum: 0,
            });
            _user.save((err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }).then(data => {
        if (data) {//注册成功
            ctx.body = {
                status: 1,
                msg: "注册成功"
            }
        } else {//用户名已存在
            ctx.body = {
                status: 0,
                msg: "用户名已存在"
            }
        }
    }).catch(err => {
        //注册失败
        ctx.body = {
            status: 0,
            msg: "注册失败"
        }
    })
};

//用户登入
exports.login = async ctx => {
    if (ctx.path === '/favicon.ico') {return}
    const user = ctx.request.body;
    const username = user.username;
    const password = user.password;
    await new Promise((resolve, reject) => {
        //user数据库查询
        User.find({username}, (err, data) => {
            if (err) {
                return reject(err)
            }
            if (data.length === 0) {
                //用户不存在
                return reject("用户不存在")
            }

            //匹配密码
            if (data[0].password === encryto(password)) {
                //匹配成功
                resolve(data)
            } else {
                //匹配失败
                resolve("")
            }
        })
    })
        .then(data => {
            if (data) {
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
                    uid: data[0]._id,
                    avatar: data[0].avatar,
                    role: data[0].role,
                };
                ctx.body = {
                    status: 1,
                    msg: "登入成功"
                }
            } else {
                ctx.body = {
                    status: 0,
                    msg: "密码错误"
                }
            }
        })
        .catch(err => {
            if (err === "用户不存在") {
                ctx.body = {
                    status: 0,
                    msg: "用户不存在"
                }
            } else {
                ctx.body = {
                    status: 0,
                    msg: "登入失败"
                }
            }
        })

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
    ctx.cookies.set("username", null, {maxAge: 0});
    ctx.cookies.set("uid", null, {maxAge: 0});
    ctx.body={session:true}
};

//获取用户
exports.userList = async ctx => {
    const userList = await User
        .find()
        .then(data => data)
        .catch(err => console.log(err));

    ctx.body = {
        userList
    };
};

//上传用户头像
exports.upload = async ctx => {
    const filename = ctx.req.file.filename;
    let data = {
        status: 1,
        msg: "上传成功"
    };
    // http://106.14.145.207/node/images
    await User.updateOne(
        {_id: ctx.session.uid},
        {$set: {avatar: "http://106.14.145.207/node/images/avatar/" + filename}},
        (err, res) => {
        if (err) {
            return data = {
                status: 0,
                msg: "上传失败"
            }
        } else {
            ctx.session.avatar = "http://106.14.145.207/node/images/avatar/" + filename;
        }
    });

    ctx.body = data
};

//删除用户
exports.del = async ctx => {
    const userId = ctx.query.uid

    let res = {
        status: 1,
        msg: "删除成功",
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