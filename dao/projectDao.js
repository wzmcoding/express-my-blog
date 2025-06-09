const projectModel = require("./model/projectModel");

// 查询所有项目
module.exports.findAllProjectDao = async function () {
    return await projectModel.findAll();
}

// 新增项目
module.exports.addProjectDao = async function (projectInfo) {
    const {
        dataValues
    } = await projectModel.create(projectInfo);
    return dataValues;
}

// 修改项目
module.exports.updateProjectDao = async function (id, newProjectInfo) {
    await projectModel.update(newProjectInfo, {
        where: {
            id,
        }
    });
    return await projectModel.findByPk(id);
}

// 删除项目
module.exports.deleteProjectDao = async function (id) {
    return await projectModel.destroy({
        where: {
            id
        }
    });
}
