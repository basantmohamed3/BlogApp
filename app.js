const       express           = require("express"),
            bodyParser        = require("body-parser"),
            mongoose          = require("mongoose"),
            ejs               = require("ejs"),
            app               = express(),
            Blog              = require("./models/blog.js"),
            expressSanitizer  = require("express-sanitizer"),
            methodOverride    = require("method-override")

mongoose.connect("mongodb+srv://basant:engineer@cluster0-hr45z.mongodb.net/test?retryWrites=true",{useNewUrlParser: true, useFindAndModify: false})
.then (()=>{
    console.log("connected to DB");
    
})
.catch (()=>{
    console.log("connection to DB failed")
})
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(express.static( __dirname +'/public'));

app.use(methodOverride("_method"));


//created db 





//restful route 

app.get("/", (req,res)=>{
    res.redirect("/blogs");
})

//find data and display it by templeating
app.get ("/blogs", (req,res)=>{
    Blog.find({}, (error, dataFound)=>{
        if (error){
            console.log(error);
        }else {

                res.render("index", {blogs: dataFound});
        }
    })
})
//post request: get request body and post it to the main page
app.post ("/blogs", (req,res)=>{
   var newBlog = req.body.blog;
    Blog.create(newBlog,(error, data)=>{
    if (error){
        console.log(error);
    }else  
    {
      res.redirect("/blogs")
    }
} )
    
})

// form for new post

app.get ("/blogs/new", (req,res)=>{
    res.render("new");
})
// show the page of certain blog

app.get ("/blogs/:id", (req,res)=>{
 var blogId= req.params.id 

Blog.findById(blogId, (error, data)=>{
    if (error) {
      res.redirect("/blogs");
    }else
      res.render("show",{blog: data});
})    
    
  
})

//edit path

app.get("/blogs/:id/edit", (req,res)=>{
    var blogId = req.params.id;
    Blog.findById(blogId, (error, data)=>{
        if (error){
            console.log(error)
            res.redirect("/blogs")
        }else {
             res.render("edit", {blog: data})
        }
    })
   
})
// update route 
app.put("/blogs/:id", (req,res)=>{
      var oldId = req.params.id;
      var newId = req.body.blog;
    Blog.findByIdAndUpdate(oldId, newId, (error, updatedBlog)=>{   // takes 3 arguments(id, new data, callback)
        if(error){
            res.resirect("/blogs")
        }else 
            {
                res.redirect("/blogs/"+oldId)
            }
        
    } )         
})

//delete route
app.delete("/blogs/:id", (req,res)=>{
      var oldId = req.params.id;
     
    Blog.findByIdAndRemove(oldId, (error)=>{   
        if(error){
            res.resdrect("/blogs")
        }else 
            {  console.log("deleted successfully")
                res.redirect("/blogs")
            }
        
    } )      
  
})
app.listen(process.env.PORT, process.env.IP, (req,res)=>{
    console.log("Blog-1 server is ON!!!");
});
     