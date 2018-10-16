const multer = require('koa-multer');
const { join } = require('path');

const storage = multer.diskStorage({
    // 存储的位置
    destination: join(__dirname, "../images/avatar"),
    // 文件名
    filename(req, file, cb){
        // console.log(file)
        const filename = file.originalname.split(".");
        cb(null, `${Date.now()}.${filename[filename.length - 1]}`)
    }
});

module.exports = multer({storage});

