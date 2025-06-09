const {
    DataTypes
} = require("sequelize");
const sequelize = require("../dbConnect");

// 定义数据模型
module.exports = sequelize.define("setting", {
    avatar: {
        type: DataTypes.STRING,
        allowNull: false
    },
    siteTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    github: {
        type: DataTypes.STRING,
        allowNull: false
    },
    qq: {
        type: DataTypes.STRING,
        allowNull: false
    },
    qqQrCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    weixin: {
        type: DataTypes.STRING,
        allowNull: false
    },
    weixinQrCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    icp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    githubName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    favicon: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false
});
