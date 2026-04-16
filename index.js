import express from "express";
const app = express();
const port = 3000;

app.use(express.urlencoded({extended : true})); // middleware to access data from req

app.use(express.static("public"));

const blog0 = {
    title : "AI",
    content : "AI can never replace humans!",
    user_id : 0
}

const blog1 = {
    title : "Global Warming!",
    content : "global warming is a major concern which really need Attention.",
    user_id : 1
}

const user0 = {
    id: 0, 
    name: "Soham"
}

const user1 = {
    id: 1, 
    name: "Uddhav"
}

const user2 = {
    id: 2, 
    name: "Aditya"
}

const user3 = {
    id: 3, 
    name: "Gaurish"
}

const users = [user0,user1,user2,user3]

const blogs = [blog0, blog1]

const comments = []

app.post("/blogs/:id/comments", (req, res) => {
    const blogId = parseInt(req.params.id);
    const userId = parseInt(req.body.user_id);
    const content = req.body.content;

    const newComment = {
        blog_id: blogId,
        user_id: userId,
        content: content
    };

    comments.push(newComment);

    res.redirect(`/blogs/${blogId}`);
});
app.get("/blogs/new",(req,res)=>{
    res.render("new.ejs",{
        users : users
    });
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
        id : req.params.id,
        users : users,
        comments : comments
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
        content : req.body["content"],
        user_id : parseInt(req.body["user_id"])
    }

    blogs.push(newBlog);
    res.redirect("/");
});

app.listen(port,()=>{
    console.log(`Server is running on port ${3000}.`);
});


