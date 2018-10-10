const crypto = require('crypto');

//加密对象 返回出加密成功的数据
module.exports = (password,key = "zhe shi ce shi") => {
    const hmac = crypto.createHmac("sha256", key);
    hmac.update(password);
    const passwordHmac = hmac.digest("hex");
    return passwordHmac
};