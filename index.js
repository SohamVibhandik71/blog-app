import express from "express";
import mysql from "mysql2";
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
    db.query("SELECT * FROM blogs",(err,results)=>{
        if(err){
            console.log(err);
        }else{
            res.render("index.ejs",{blogsList : results});
        }
    });
});

app.get("/blogs/:id/edit",(req,res)=>{
    const blogId = req.params.id;

    db.query(
        "SELECT * FROM blogs WHERE id = ?",
        [blogId],
        (err,result)=>{
            if(err){
                console.log(err);
                return res.send("Error");
            }
            const blog = result[0];
            res.render("edit.ejs",{
                currBlog: blog,
                id: blogId
            })
        }
    );

});

app.get("/blogs/:id", (req, res) => {
    const blogId = req.params.id;

    db.query(
        `SELECT blogs.*, users.name AS author
         FROM blogs
         JOIN users ON blogs.user_id = users.id
         WHERE blogs.id = ?`,
        [blogId],
        (err, results) => {
            if (err) {
                console.log(err);
                return res.send("Error");
            }

            const blog = results[0];

            res.render("show.ejs", {
                currBlog: blog
            });
        }
    );
});

app.post("/blogs/:id/edit",(req,res)=>{
    const blogId = req.params.id;
    const updatedBlog = {
        title : req.body.title,
        content : req.body.content
    }

    db.query(
        "UPDATE blogs SET title = ?, content = ? WHERE id = ?",
        [updatedBlog.title, updatedBlog.content, blogId],
        (err,result) =>{
            if(err){
                console.log(err);
                return res.send("Error updating blog");
            }
            res.redirect(`/blogs/${blogId}`);
        }
    );
});


app.post("/blogs/:id/delete",(req,res)=>{
    const blogId = req.params.id;

    db.query(
        "DELETE FROM blogs WHERE id = ?",
        [blogId],
        (err,result) => {
            if(err){
                console.log(err);
                return res.send("Error deleting blog");
            }

            res.redirect("/");
        }
    );
});

app.post("/blogs",(req,res)=>{
    const newBlog = {
        title : req.body["title"],
        content : req.body["content"],
        user_id : parseInt(req.body["user_id"])
    }
    db.query(
        "INSERT INTO blogs (title, content, user_id ) VALUES (?, ?, ?)",
        [newBlog.title, newBlog.content, parseInt(newBlog.user_id)],
        (err,result) =>{
            if(err){
                console.log(err);
                return res.send("Error inserting Blog");
            }

            res.redirect("/")
        }
    )
});

app.listen(port,()=>{
    console.log(`Server is running on port ${3000}.`);
});


//Database

const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "soham",
    database : "blog_app"
});


db.connect((err)=>{
    if(err){
        console.log("DB connection failed", err);
    }else{
        console.log("Connected to MySQL");
    }
});