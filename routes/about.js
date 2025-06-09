const express = require("express");
const router = express.Router();
const aboutService = require("../service/aboutService");

// 获取关于页面的url
router.get("/", async (req, res) => {
    res.send(await aboutService.findAboutService());
});

// 设置关于页面的url
router.put("/", async (req, res) => {
    res.send(await aboutService.updateAboutService(req.body.url));
});

module.exports = router;
