const Sequelize = require("sequelize");
const connection = new Sequelize('guiapress', 'root', 'Qwaszx123*',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;
