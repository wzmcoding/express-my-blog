const aboutDao = require("../dao/aboutDao");
const { formatResponse } = require("../utils/tool");

// 获取关于页面的url
module.exports.findAboutService = async function () {
    const { url } = await aboutDao.findAboutDao();
    return formatResponse(undefined, undefined, url);
}

// 设置关于页面的url
module.exports.updateAboutService = async function (newUrl) {
    const { url } = await aboutDao.updateAboutDao(newUrl);
    return formatResponse(undefined, undefined, url);
}
