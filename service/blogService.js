const { ValidationError } = require("../utils/errors");
const { validate } = require("validate.js");
const blogTypeModel = require("../dao/model/blogTypeModel");
const blogDao = require("../dao/blogDao");
const blogTypeDao = require("../dao/blogTypeDao");
const { formatResponse, handleDataPattern } = require("../utils/tool");

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
    blogInfo.toc = JSON.stringify('["a": "b"]');

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
