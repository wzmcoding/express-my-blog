const settingModel = require("./model/settingModel");

// 查询全局设置
module.exports.findSettingDao = async function () {
    return await settingModel.findOne();
}

// 修改全局设置
module.exports.updateSettingDao = async function (settingInfo) {
    await settingModel.update(settingInfo, {
        where: {
            id: 1
        }
    });
    return await settingModel.findOne();
}
