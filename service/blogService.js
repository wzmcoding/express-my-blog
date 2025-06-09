const { ValidationError } = require("../utils/errors");
const { validate } = require("validate.js");
const blogTypeModel = require("../dao/model/blogTypeModel");
const blogDao = require("../dao/blogDao");
const blogTypeDao = require("../dao/blogTypeDao");
const messageDao = require("../dao/messageDao");
const { formatResponse, handleDataPattern, handleTOC } = require("../utils/tool");

// 扩展验证规则
validate.validators.categoryIdIsExist = async function (value) {
    const blogTypeInfo = await blogTypeModel.findByPk(value);
    if (blogTypeInfo) {
        return;
    }
    return "CategoryId Is Not Exist";
}

// 添加博客
module.exports.addBlogService = async function (blogInfo) {
    // 处理TOC
    // 经过 handleTOC 函数进行处理之后,现在 blogInfo 里面的 TOC 目录就是我们想要的格式
    blogInfo = handleTOC(blogInfo);

    blogInfo.toc = JSON.stringify(blogInfo.toc);

    // 初始化新文章的其他信息
    blogInfo.scanNumber = 0; // 阅读量初始化为0
    blogInfo.commentNumber = 0; // 评论数初始化为0

    // 定义验证规则
    const blogRule = {
        title: {
            presence: {
                allowEmpty: false
            },
            type: "string"
        },
        description: {
            presence: {
                allowEmpty: true
            },
            type: "string"
        },
        toc: {
            presence: {
                allowEmpty: true
            },
            type: "string"
        },
        htmlContent: {
            presence: {
                allowEmpty: false
            },
            type: "string"
        },
        thumb: {
            presence: {
                allowEmpty: true
            },
            type: "string"
        },
        scanNumber: {
            presence: {
                allowEmpty: false
            },
            type: "integer"
        },
        commentNumber: {
            presence: {
                allowEmpty: false
            },
            type: "integer"
        },
        createDate: {
            presence: {
                allowEmpty: false
            },
            type: "integer"
        },
        categoryId: {
            presence: true,
            type: "integer",
            categoryIdIsExist: true
        }
    };

    // 对传递过来的数据进行验证
    try {
        // 因为扩展的验证规则里面涉及到异步的操作,所以这里要采用异步的验证方式
        await validate.async(blogInfo, blogRule);
        const data = await blogDao.addBlogDao(blogInfo); // 新增操作
        // 文章新增,对应的文章分类也要新增
        await blogTypeDao.addBlogToType(blogInfo.categoryId);
        return formatResponse(undefined, undefined, data);
    } catch (e) {
        // 验证未通过
        throw new ValidationError("数据验证失败");
    }
}

// 根据分页获取文章
module.exports.findBlogByPageService = async function (pageInfo) {
    const data = await blogDao.findBlogByPageDao(pageInfo);
    const rows = handleDataPattern(data.rows);
    // 处理toc
    rows.forEach(it => {
        it.toc = JSON.parse(it.toc);
    })
    return formatResponse(undefined, undefined, {
        total: data.count,
        rows
    });
}

// 根据id获取某篇博文
module.exports.findBlogByIdService = async function (id, auth) {
    const data = await blogDao.findBlogByIdDao(id);
    // 重新处理 TOC ,还原成一个数组
    data.dataValues.toc = JSON.parse(data.dataValues.toc);
    // 根据auth是否有值来决定浏览数是否需要自增
    if (!auth) {
        data.scanNumber ++ ;
        await data.save();
    }
    return formatResponse(undefined, undefined, data.dataValues);
}

// 修改博客
module.exports.updateBlogService = async function (id, blogInfo) {
    // 判断正文内容有没有改变,因为正文改变会影响 TOC
    if(blogInfo.htmlContent) {
        // 说明文章正文内容改变了,需要重新处理 TOC 目录
        blogInfo = handleTOC(blogInfo);
        blogInfo.toc = JSON.stringify(blogInfo.toc);
    }

    // 这里涉及到一个问题，就是文章分类有没有修改，如果有修改，之前的文章分类对应的文章数量要自减
    // 新的文章分类对应的文章数量要自增
    const { dataValues: oldBlogInfo } = await blogDao.findBlogByIdDao(id);
    if(blogInfo.categoryId !== oldBlogInfo.categoryId) {
        // 如果进入此 if，说明修改了此文章的分类信息，那么修改前后的文章分类对应的文章数量都需要做出修改
        const oldBlogType = await blogTypeDao.findOneBlogTypeDao(oldBlogInfo.categoryId);
        oldBlogType.articleCount --;
        await oldBlogType.save();

        const newBlogType = await blogTypeDao.findOneBlogTypeDao(blogInfo.categoryId);
        newBlogType.articleCount ++;
        await newBlogType.save();
    }

    // 判断有没有 TOC, 如果有 TOC 需要做处理
    const { dataValues } = await blogDao.updateBlogDao(id, blogInfo);
    return formatResponse(undefined, undefined, dataValues);
}

// 删除一篇文章
module.exports.deleteBlogService = async function (id) {
    // 根据 id 查询到该篇文章的信息
    const data = await blogDao.findBlogByIdDao(id);
    // 根据文章对应的分类,将该分类下的文章数量自减
    const categoryInfo = await blogTypeDao.findOneBlogTypeDao(data.dataValues.categoryId);
    categoryInfo.articleCount --;
    await categoryInfo.save();
    // 对该文章下所对应的评论也一并删除
    await messageDao.deleteMessageByBlogIdDao(id);
    // 删除文章
    await blogDao.deleteBlogDao(id);
    return formatResponse(undefined, undefined, true);
}
