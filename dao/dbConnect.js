// 该文件负责连接数据库
const { Sequelize } = require("sequelize")

// 创建数据库连接
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false
});

async function sync() {
    try {
        await sequelize.authenticate()
        console.log('数据库连接成功')
    } catch (error) {
        console.error('数据库连接失败:', error)
    }
}
sync()