import express from "express";
import mysql from "mysql2";
const app = express();
const port = 3000;

app.use(express.urlencoded({extended : true})); // middleware to access data from req

app.use(express.static("public"));


app.post("/user", (req,res)=>{
     
    const newUser = {
        name : req.body.name
    }

    db.query(
        "INSERT INTO users (name) VALUES (?)",
        [newUser.name],
        (err,result) =>{
            if(err){
                console.log(err);
                return res.send("Error while adding new user");
            }
            res.redirect("/")
        }
    );
});

app.post("/blogs/:id/comments", (req, res) => {
    const blogId = parseInt(req.params.id);
    const userId = parseInt(req.body.user_id);
    const content = req.body.content;

    db.query(
        "INSERT INTO comments (blog_id, user_id, content) VALUES (?, ?, ?)",
        [blogId, userId, content],
        (err,result) => {
            if(err){
                console.log(err);
                return res.send("Error adding comment");
            }

            res.redirect(`/blogs/${blogId}`);
        }
    );
});


app.get("/blogs/new", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) {
            console.log(err);
            return res.send("Error fetching users");
        }

        res.render("new.ejs", {
            users: results
        });
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

    // Blog + Author
    db.query(
        `SELECT blogs.*, users.name AS author
         FROM blogs
         JOIN users ON blogs.user_id = users.id
         WHERE blogs.id = ?`,
        [blogId],
        (err, blogResult) => {
            if (err) {
                console.log(err);
                return res.send("Error");
            }

            const blog = blogResult[0];

            //comments + users
            db.query(
                `SELECT comments.*, users.name AS author
                 FROM comments
                 JOIN users ON comments.user_id = users.id
                 WHERE comments.blog_id = ?`,
                [blogId],
                (err, commentResult) => {
                    db.query("SELECT * FROM users", (err, userResults) => {
                        if (err) {
                            console.log(err);
                            return res.send("Error fetching users");
                        }

                        res.render("show.ejs", {
                            currBlog: blog,
                            comments: commentResult,
                            users: userResults
                        });
                    });
                }
            );
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


app.post("/blogs/:id/delete", (req, res) => {
    const blogId = req.params.id;

    // delete comments first(because mySQL dont allow delete blog becoz, Blog (parent row) is being used in comments (child rows))

    //delete comments first
    db.query(
        "DELETE FROM comments WHERE blog_id = ?",
        [blogId],
        (err) => {
            if (err) {
                console.log(err);
                return res.send("Error deleting comments");
            }

            //  delete blog
            db.query(
                "DELETE FROM blogs WHERE id = ?",
                [blogId],
                (err) => {
                    if (err) {
                        console.log(err);
                        return res.send("Error deleting blog");
                    }

                    res.redirect("/");
                }
            );
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