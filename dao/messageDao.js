const blogModel = require("./model/blogModel");
const messageModel = require("./model/messageModel");
const { Op } = require("sequelize");

module.exports.findMessageByPageDao = async function (pageInfo) {
    // 根据 blogId 来区分情况
    // 如果有 blogId, 说明是获取对应 blogId 的文章评论，如果没有，说明是获取留言
    if (pageInfo.blogId) {
        // 这边又分为两种情况，获取所有的文章评论，另一种是获取对应文章的评论
        if (pageInfo.blogId === 'all') {
            // 返回所有评论
            return await messageModel.findAndCountAll({
                offset: (pageInfo.page * 1 - 1) * pageInfo.limit,
                limit: pageInfo.limit * 1,
                where: {
                    blogId: {
                        [Op.ne]: null,
                    },
                },
                include: [{
                    model: blogModel,
                    as: "blog"
                }]
            });
        } else {
            // 返回对应文章的评论
            return await messageModel.findAndCountAll({
                offset: (pageInfo.page * 1 - 1) * pageInfo.limit,
                limit: pageInfo.limit * 1,
                where: {
                    blogId: pageInfo.blogId * 1,
                },
                order: [
                    ["createDate", "DESC"]
                ]
            });
        }
    } else {
        return await messageModel.findAndCountAll({
            offset: (pageInfo.page * 1 - 1) * pageInfo.limit,
            limit: pageInfo.limit * 1,
            order: [
                ["createDate", "DESC"]
            ]
        });
    }
}

module.exports.addMessageDao = async function (messageInfo) {
    const {
        dataValues
    } = await messageModel.create(messageInfo);
    return dataValues;
}

module.exports.deleteMessageDao = async function (id) {
    return await messageModel.destroy({
        where: {
            id
        }
    });
}

module.exports.findOneMessageDao = async function (id) {
    const { dataValues } = await messageModel.findByPk(id);
    return dataValues;
}
