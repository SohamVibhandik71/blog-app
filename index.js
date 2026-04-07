import express from "express";
const app = express();
const port = 3000;

const blog0 = {
    title : "AI",
    content : "AI can never replace humans!"
}

const blog1 = {
    title : "Global Warming!",
    content : "global warming is a major concern which really need Attention."
}

const blogs = [blog0, blog1]

app.get("/",(req,res)=>{
    res.render("index.ejs",{blogsList : blogs});
});

app.get("/blog/:id",(req,res)=>{
    res.render("show.ejs",{currBlog : blogs[req.params.id]});
})



app.listen(port,()=>{
    console.log(`Server is running on port ${3000}.`);
});


