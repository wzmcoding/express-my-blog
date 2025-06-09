const { findAllProjectDao, addProjectDao, updateProjectDao, deleteProjectDao } = require("../dao/projectDao");
const validate = require("validate.js");
const { formatResponse, handleDataPattern } = require("../utils/tool");
const { ValidationError } = require("../utils/errors");

module.exports.findAllProjectService = async function () {
    const data = await findAllProjectDao();
    const obj = handleDataPattern(data);
    // 将项目描述还原成数组
    obj.forEach(item => {
        item.description = JSON.parse(item.description);
    });
    return formatResponse(undefined, undefined, obj);
}

module.exports.addProjectService = async function (projectInfo) {
    // 将 description 转换为字符串
    projectInfo.description = JSON.stringify(projectInfo.description);
    // 定义验证规则
    const projectRule = {
        name: {
            presence: {
                allowEmpty: false,
            },
            type: "string",
        },
        url: {
            presence: {
                allowEmpty: false,
            },
            type: "string",
        },
        github: {
            presence: {
                allowEmpty: false,
            },
            type: "string",
        },
        description: {
            presence: {
                allowEmpty: false,
            },
            type: "string",
        },
        order: {
            presence: {
                allowEmpty: false,
            },
            type: "integer",
        },
        thumb: {
            presence: {
                allowEmpty: false,
            },
            type: "string",
        }
    }
    // 进行数据验证
    const validateResult = validate.validate(projectInfo, projectRule);
    if (!validateResult) {
        const data = await addProjectDao(projectInfo);
        return formatResponse(undefined, undefined, [data]);
    } else {
        throw new ValidationError("数据验证失败");
    }
}

module.exports.updateProjectService = async function (id, newProjectInfo) {
    if(newProjectInfo.description) {
        newProjectInfo.description = JSON.stringify(newProjectInfo.description);
    }
    const { dataValues } = await updateProjectDao(id, newProjectInfo);
    // 还原项目描述
    dataValues.description = JSON.parse(dataValues.description);
    return formatResponse(undefined, undefined, dataValues)
}

module.exports.deleteProjectService = async function (id) {
    await deleteProjectDao(id);
    return formatResponse(undefined, undefined, true);
}
