const express = require("express");
const router = express.Router();
const messageService = require("../service/messageService");

// 获取留言或者评论
router.get("/", async (req, res) => {
    res.send(await messageService.findMessageByPageService(req.query));
});

// 添加留言或者评论
router.post("/", async (req, res) => {
    res.send(await messageService.addMessageService(req.body));
});

// 删除留言或者评论
router.delete("/:id", async (req, res) => {
    res.send(await messageService.deleteMessageService(req.params.id));
});

module.exports = router;
