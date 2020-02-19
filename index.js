const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");

//View engine
app.set('view engine', 'ejs');

//Static
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
    res.render("index");
});

app.listen(8080, ()=>{
    console.log("Servidor rodando...");
})