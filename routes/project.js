const express = require("express");
const router = express.Router();
const { findAllProjectService, addProjectService, updateProjectService, deleteProjectService } = require("../service/projectService");

// 获取项目
router.get("/", async (req, res) => {
    res.send(await findAllProjectService());
});

// 新增项目
router.post("/", async (req, res) => {
    res.send(await addProjectService(req.body));
});

// 修改项目
router.put("/:id", async (req, res) => {
    res.send(await updateProjectService(req.params.id, req.body));
});

// 删除项目
router.delete("/:id", async (req, res) => {
    res.send(await deleteProjectService(req.params.id));
});

module.exports = router;
