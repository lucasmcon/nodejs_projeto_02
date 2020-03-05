const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

//Controllers
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");

//View engine
app.set('view engine', 'ejs');

//Static - carregamento bibliotecas e arquivos estaticos
app.use(express.static('public'));

//Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Database
connection
    .authenticate()
    .then(()=>{
        console.log("Conexão feita com sucesso");
    }).catch((error)=>{
        console.log(error);
    });

//Categories Router
app.use("/", categoriesController); //É possível criar um prefixo, Ex: app.use("/prefixo", controller);

//Articles Router
app.use("/", articlesController);
    
//Rotas
app.get("/", (req,res)=>{

    Article.findAll({
        order:[
            ['id', 'DESC']
        ]
    }).then(articles =>{
        res.render("index", {articles: articles});
    })
});

app.get("/:slug", (req,res)=>{
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article =>{
        if(article != undefined){
            res.render("article", {article: article});
        }else{
            res.redirect("/");
        }
    }).catch(err =>{
        res.redirect("/");
    })
})

app.listen(8090, ()=>{
    console.log("Servidor rodando...");
})