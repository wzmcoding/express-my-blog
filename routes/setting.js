const express = require("express");
const router = express.Router();
const settingService = require("../service/settingService");

// 获取全局设置
router.get("/", async (req, res) => {
    res.send(await settingService.findSettingService());
});

// 更新全局设置
router.put("/", async (req, res) => {
    res.send(await settingService.updateSettingService(req.body));
});
module.exports = router;
