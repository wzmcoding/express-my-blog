const messageDao = require("../dao/messageDao");
const blogDao = require("../dao/blogDao");
const validate = require("validate.js");
const { ValidationError, UnknowError } = require("../utils/errors");
const fs = require("fs");
const { formatResponse, handleDataPattern } = require("../utils/tool");
const dir = './public/static/avatar';

/**
 * 读取一个目录下有多少个文件
 * @param {*} dir 目录地址
 */
async function readDirLength(dir) {
    return new Promise((resolve) => {
        fs.readdir(dir, (err, files) => {
            if (err) throw new UnknowError();
            resolve(files);
        })
    });
}

// 新增评论或者留言
module.exports.addMessageService = async function (messageInfo) {
    // 数据验证规则
    const messageRule = {
        nickname: {
            presence: {
                allEmpty: false
            },
            type: "string"
        },
        content: {
            presence: {
                allEmpty: false
            },
            type: "string"
        },
        blogId: {
            type: "string"
        }
    }

    // 进行数据验证
    const validateResult = validate.validate(messageInfo, messageRule);
    if (!validateResult) {
        messageInfo.blogId = messageInfo.blogId ? messageInfo.blogId : null;
        messageInfo.createDate = Date.now();
        // 头像地址是随机生成的
        // 读取 static 下面的 avatar 目录
        const files = await readDirLength(dir);
        // 随机获取一个头像
        const randomIndex = Math.floor(Math.random() * files.length);
        messageInfo.avatar = "/static/avatar/" + files[randomIndex];
        // 新增
        const data = await messageDao.addMessageDao(messageInfo);
        // 如果是文章的评论,那么对应的文章评论数量也要自增
        if (messageInfo.blogId) {
            const blogData = await blogDao.findBlogByIdDao(messageInfo.blogId);
            blogData.commentNumber ++;
            await blogData.save();
        }
        return formatResponse(undefined, undefined, data);
    } else {
        throw new ValidationError("数据验证失败");
    }
}

// 获取评论或者留言
module.exports.findMessageByPageService = async function (pageInfo) {
    const data = await messageDao.findMessageByPageDao(pageInfo);
    const rows = handleDataPattern(data.rows);
    return formatResponse(undefined, undefined, {
        total: data.count,
        rows
    });
}

// 删除评论或者留言
module.exports.deleteMessageService = async function (id) {
    const data = await messageDao.findOneMessageDao(id);
    if(data.blogId) {
        const blogData = await blogDao.findBlogByIdDao(data.blogId);
        blogData.commentNumber --;
        await blogData.save();
    }
    await messageDao.deleteMessageDao(id);
    return formatResponse(undefined, undefined, true);
}
