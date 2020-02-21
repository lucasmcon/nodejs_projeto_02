const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category"); //Importação do model para relacionamento 1:1


const Article = connection.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug:{
        type: Sequelize.STRING,
        allowNull: false
    },body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Category.hasMany(Article); //Relação 1:n
Article.belongsTo(Category); //Relação 1:1

//Article.sync({force: true}); //- utilizar esse comando somente na primeira vez, para criar a tabela

module.exports = Article;