const express = require("express");
const multer = require("multer");
const {
    UploadError
} = require("../utils/errors");
const {
    uploading, formatResponse
} = require("../utils/tool");
const router = express.Router();

router.post("/", async (req, res, next) => {
    // single 方法里面书写上传控件的 name 值
    uploading.single("file")(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            next(new UploadError("上传文件失败，请检查文件的大小, 控制在 2MB 以内"));
        } else {
            const path = "/static/uploads/" + req.file?.filename;
            res.send(formatResponse(undefined, undefined, path))
        }
    })
});

module.exports = router;
