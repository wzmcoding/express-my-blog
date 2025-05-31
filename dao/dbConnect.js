// 该文件负责连接数据库
const { Sequelize } = require("sequelize")

// 创建数据库连接
const sequelize = new Sequelize('my-blog', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // 不显示 sql语句
})

async function sync() {
    try {
        await sequelize.authenticate()
        console.log('数据库连接成功')
    } catch (error) {
        console.error('数据库连接失败:', error)
    }
}
sync()