const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugfy = require("slugify");

router.get("/admin/articles", (req, res)=>{
    Article.findAll({
        include: [{model: Category}]
    }).then(articles =>{
        res.render("admin/articles/index", {articles: articles});
    })
});

router.get("/admin/articles/new", (req,res)=>{
    Category.findAll().then(categories =>{
        res.render("admin/articles/new", {categories: categories});
    })
});

router.get("/admin/articles", (req,res)=>{
    res.render("admin/articles/index");
})

router.post("/articles/save", (req,res)=>{
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title: title,
        slug: slugfy(title),
        body: body,
        categoryId: category
    }).then(() =>{
        res.redirect("/admin/articles");
    })
})

router.post("/articles/update", (req,res)=>{
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.update({title: title, body: body, slug: slugfy(title), categoryId: category},{
        where: {
            id: id
        }
    }).then(()=>{
        res.redirect("/admin/articles");
    })
});

router.post("/articles/delete", (req, res)=>{
    var id = req.body.id;
    if(id != undefined){
        Article.destroy({
            where: {
                id: id
            }
        }).then(()=>{
            res.redirect("/admin/articles");
        });
    }else{
        res.redirect("/admin/articles");
    }
});

router.get("/admin/articles/edit/:id", (req,res) =>{
    var id = req.params.id;
    
    if(isNaN(id)){
        res.redirect("/admin/articles");
    }

    Article.findByPk(id).then(article =>{
        if(article != undefined){
            Category.findAll().then(categories =>{
                if(categories != undefined){
                    res.render("admin/articles/edit", {article: article, categories: categories});
                }else{
                    res.redirect("/admin/articles");
                }
            })
        }else{
            res.redirect("/admin/articles");
        }
    }).catch(err =>{
        res.redirect("/admin/articles");
    })
});

router.get("/articles/page/:num", (req,res)=>{
    
    var page = req.params.num;
    var offset = 0;
    
    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = (parseInt(page) -1) * 5;
    }
     
    Article.findAndCountAll({
        limit: 5,
        offset: offset,
        order: [
            ['id', 'DESC']
        ]
    }).then(articles =>{

        var next;
        if(offset + 5 >= articles.count){
            next = false;
        }else{
            next = true;
        }

        var result = {
            page: parseInt(page),
            next : next,
            articles : articles
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories: categories})
        })
    })
});

module.exports = router;