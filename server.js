const express = require('express');
const layouts = require('express-ejs-layouts');
const fs = require('fs'); //fancy way of saying local harddrive
const methodOverride = require('method-override');

const PORT = 3000;

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(layouts); 
app.use(express.static(__dirname + '/static'));
app.use(methodOverride('_method'));

app.get("/", function(req, res) {
	res.send("This town needs guns. And by town I mean page and by guns I mean content.");
});

app.get("/articles", function(req,res) {
	var articles = fs.readFileSync('./articles.json'); //gets string contents of an article, must then parse
	var articleData = JSON.parse(articles);
	res.render("articles/index", {articleData});
});

app.get('/articles/new', function(req, res) {
	res.render('articles/new');
})

//edit
app.get('/articles/:id/edit', function(req, res) {
	let articles = fs.readFileSync('./articles.json');
	let articleData = JSON.parse(articles);
	let id = parseInt(req.params.id);
	res.render('articles/edit',{article: articleData[id], id});
});

//show
app.get("/articles/:id", function(req, res) {
	var articles = fs.readFileSync('./articles.json');
	var articleData = JSON.parse(articles);
	var id = parseInt(req.params.id);
	res.render('articles/show', {article: articleData[id], id});
});

//post new
app.post('/articles', function(req, res) {
	//read in our JSON file
	var articles = fs.readFileSync('./articles.json');
	//convert to array
	var articleData = JSON.parse(articles);
	var newArticle ={
		title: req.body.articleTitle,
		body: req.body.articleBody
	}
	articleData.push(newArticle);
	//push new data into the array
	fs.writeFileSync('./articles.json', JSON.stringify(articleData));
	//write the array back to the file

	res.redirect('/articles');
});

//delete
app.delete('/articles/:id', function(req, res) {
	//read the data from the file
	let articles = fs.readFileSync('./articles.json');
	//parse the data into an object
	var articleData = JSON.parse(articles);
	//splice out the item at the specificed index
	var id = parseInt(req.params.id);
	articleData.splice(id, 1);
	//stringify it
	var articleString = JSON.stringify(articleData);
	//write the object back into the file
	fs.writeFileSync('./articles.json', articleString);
	res.redirect('/articles');
}); 

//put
app.put('/articles/:id', function(req, res) {
	console.log("edit function working")
	let articles = fs.readFileSync('./articles.json');
	var articleData = JSON.parse(articles);
	var id = parseInt(req.params.id);
	articleData[id].title = req.body.title;
	articleData[id].body= req.body.body;
	fs.writeFileSync('./articles.json', JSON.stringify(articleData));
	res.redirect("/articles/" + id);
})




app.listen( PORT || 3000 );