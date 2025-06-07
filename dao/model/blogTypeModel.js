const {
    DataTypes
} = require("sequelize");
const sequelize = require("../dbConnect");

// 定义数据模型
module.exports = sequelize.define("blogType", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    articleCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false
});
