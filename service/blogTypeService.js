const {
    ValidationError
} = require("../utils/errors");
const {
    validate
} = require("validate.js");
const blogTypeDao = require("../dao/blogTypeDao");
const {
    formatResponse,
    handleDataPattern
} = require("../utils/tool");

// 新增博客分类
module.exports.addBlogTypeService = async (newBlogTypeInfo) => {
    // 数据验证规则
    const blogTypeRule = {
        name: {
            presence: {
                allowEmpty: false
            },
            type: "string"
        },
        order: {
            presence: {
                allowEmpty: false
            },
            type: "number"
        }
    }
    // 进行数据验证
    const validateResult = validate(newBlogTypeInfo, blogTypeRule);
    if (!validateResult) {
        // 验证通过
        newBlogTypeInfo.articleCount = 0; // 因为是新增的文章分类，所以一开始文章数量为0
        const data = await blogTypeDao.addBlogTypeDao(newBlogTypeInfo);
        return formatResponse(undefined, undefined, data);
    } else {
        // 数据验证失败
        throw new ValidationError("数据验证失败");
    }
};

// 查询所有博客分类
module.exports.findAllBlogTypeService = async () => {
    const data = await blogTypeDao.findAllBlogTypeDao();
    const obj = formatResponse(undefined, undefined, handleDataPattern(data));
    obj.data.sort((a, b) => a.order - b.order);
    return obj;
};

// 获取其中一个博客分类
module.exports.findOneBlogTypeService = async (id) => {
    const { dataValues  } = await blogTypeDao.findOneBlogTypeDao(id);
    return formatResponse(undefined, undefined, dataValues )
};

// 修改其中一个博客分类
module.exports.updateBlogTypeService = async (id, newBlogTypeInfo) => {
    const data = await blogTypeDao.updateBlogType(id, newBlogTypeInfo);
    return formatResponse(undefined, undefined, data);
};

// 删除其中一个博客分类
module.exports.deleteBlogTypeService = async (id) => {
    await blogTypeDao.deleteBlogTypeDao(id);
    // 这里需要返回受影响的文章的数量，写了文章模块后再回来修改
    return formatResponse(undefined, undefined, true);
};
