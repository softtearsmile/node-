// 连接数据库 导出 db schema
const mongoose = require('mongoose');
const db = mongoose.createConnection
("mongodb://localhost:27017/testblog", {useNewUrlParser: true});

mongoose.Promise = global.Promise;

//把 mongoose 的 schema 取出来
const Schema = mongoose.Schema;


db.on("error", () => {
    console.log("连接失败")
});
db.on("open", () => {
    console.log("连接成功")
});

module.exports = {
    db,
    Schema,
};