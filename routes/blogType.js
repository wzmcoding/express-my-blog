const express = require("express");
const router = express.Router();
const {
    addBlogTypeService,
    findAllBlogTypeService,
    findOneBlogTypeService,
    updateBlogTypeService,
    deleteBlogTypeService
} = require("../service/blogTypeService");

// 添加博客分类
router.post("/", async (req, res, next) => {
    res.send(await addBlogTypeService(req.body));
});

// 获取博客分类
router.get("/", async (req, res) => {
    res.send(await findAllBlogTypeService());
});

// 获取其中一个博客分类
router.get("/:id", async (req, res) => {
    res.send(await findOneBlogTypeService(req.params.id));
});

// 修改其中一个博客分类
router.put("/:id", async (req, res) => {
    res.send(await updateBlogTypeService(req.params.id, req.body));
});

// 删除其中一个博客分类
router.delete("/:id", async (req, res) => {
    res.send(await deleteBlogTypeService(req.params.id));
});

module.exports = router;
