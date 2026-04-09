import express from "express";
const app = express();
const port = 3000;

app.use(express.urlencoded({extended : true})); // middleware to access data from req

const blog0 = {
    title : "AI",
    content : "AI can never replace humans!"
}

const blog1 = {
    title : "Global Warming!",
    content : "global warming is a major concern which really need Attention."
}

const blogs = [blog0, blog1]

app.get("/blogs/delete", (req,res)=>{
    
});
app.get("/blogs/new",(req,res)=>{
    res.render("new.ejs");
});

app.get("/",(req,res)=>{
    res.render("index.ejs",{blogsList : blogs});
});

app.get("/blogs/:id/edit",(req,res)=>{
    res.render("edit.ejs",{
        currBlog : blogs[req.params.id],
        id : req.params.id
    })
});

app.get("/blogs/:id",(req,res)=>{
    res.render("show.ejs",{
        currBlog : blogs[req.params.id],
        id : req.params.id
    });
})

app.post("/blogs/:id/edit",(req,res)=>{
    const id = parseInt(req.params.id);
    const updatedBlog = {
        title : req.body["title"],
        content : req.body["content"]
    };

    blogs[id] = updatedBlog;

    res.redirect(`/blogs/${id}`);

});

app.post("/blogs/:id/delete",(req,res)=>{
    
    let index = parseInt(req.params.id);
    blogs.splice(index,1);
    res.redirect("/");

});


app.post("/blogs",(req,res)=>{
    const newBlog = {
        title : req.body["title"],
        content : req.body["content"]
    }

    blogs.push(newBlog);
    res.redirect("/");
});

app.listen(port,()=>{
    console.log(`Server is running on port ${3000}.`);
});


