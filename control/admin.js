const User = require('../models/user');
const Article = require('../models/article');
const Comment = require('../models/comment');

const fs = require('fs');
const { join } = require('path');

exports.index = async ctx => {

    //判断是否登录(手动输入路径下)
    if (ctx.session.isNew){
        ctx.status = 404;
        return await ctx.render('404',{title: 404})
    }

    const id = ctx.params.id;
    let flag = false;
    const arr = fs.readdirSync(join(__dirname,"../views/admin"));

    arr.forEach(v => {
        const name = v.replace(/^(admin-)|(\.pug)$/g,"");
        if (id === name) {
            flag = true
        }
    });

    if (flag) {
        await ctx.render("./admin/admin-"+id,{
            role : ctx.session.role
        })
    }

};