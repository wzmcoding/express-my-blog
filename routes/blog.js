const express = require("express");
const router = express.Router();
const { addBlogService, findBlogByPageService,  } = require("../service/blogService");

// 添加博客
router.post("/", async (req, res, next) => {
    res.send(await addBlogService(req.body));
});

// 分页获取博客
router.get("/", async (req, res) => {
    res.send(await findBlogByPageService(req.query));
});

// 获取其中一个博客
router.get("/:id", async (req, res) => {
});

// 修改其中一个博客
router.put("/:id", async (req, res) => {
});

// 删除其中一个博客
router.delete("/:id", async (req, res) => {
});

module.exports = router;
