//IMPORTS
import express from "express";      // Express framework for backend
import mysql from "mysql2";         // MySQL database connection
import dotenv from "dotenv";        // To use environment variables

dotenv.config(); // Load variables from .env file

//APP SETUP
const app = express();
const port = 3000;

// bodyparser-Middleware to read form data (req.body) 
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, images, etc.)
app.use(express.static("public"));


//USER ROUTES

// Create a new user
app.post("/user", (req, res) => {
    const newUser = {
        name: req.body.name
    };

    // Insert user into database
    db.query(
        "INSERT INTO users (name) VALUES (?)",
        [newUser.name],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.send("Error while adding new user");
            }
            res.redirect("/"); // Redirect to homepage
        }
    );
});


//COMMENT ROUTES

// Add comment to a blog
app.post("/blogs/:id/comments", (req, res) => {
    const blogId = parseInt(req.params.id);
    const userId = parseInt(req.body.user_id);
    const content = req.body.content;

    db.query(
        "INSERT INTO comments (blog_id, user_id, content) VALUES (?, ?, ?)",
        [blogId, userId, content],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.send("Error adding comment");
            }

            res.redirect(`/blogs/${blogId}`); // Go back to blog page
        }
    );
});

//BLOG ROUTES

// Show form to create new blog
app.get("/blogs/new", (req, res) => {
    // Fetch users for dropdown
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


// Homepage - show all blogs
app.get("/", (req, res) => {
    db.query("SELECT * FROM blogs", (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index.ejs", { blogsList: results });
        }
    });
});


// Show edit form for a blog
app.get("/blogs/:id/edit", (req, res) => {
    const blogId = req.params.id;

    db.query(
        "SELECT * FROM blogs WHERE id = ?",
        [blogId],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.send("Error");
            }

            const blog = result[0];

            res.render("edit.ejs", {
                currBlog: blog,
                id: blogId
            });
        }
    );
});


// Show single blog with comments
app.get("/blogs/:id", (req, res) => {
    const blogId = req.params.id;

    //Fetch blog + author using JOIN
    //blogs(id, title, content, user_id) , users(id, name)
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

            // Fetch comments + commenter name using JOIN
            // comments(id,blog_id,user_id,content), users(id, name)
            db.query(
                `SELECT comments.*, users.name AS author
                 FROM comments
                 JOIN users ON comments.user_id = users.id
                 WHERE comments.blog_id = ?`,
                [blogId],
                (err, commentResult) => {

                    // Fetch users 
                    db.query("SELECT * FROM users", (err, userResults) => {
                        if (err) {
                            console.log(err);
                            return res.send("Error fetching users");
                        }

                        // Render page with all data
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


// Update blog
app.post("/blogs/:id/edit", (req, res) => {
    const blogId = req.params.id;

    const updatedBlog = {
        title: req.body.title,
        content: req.body.content
    };

    db.query(
        "UPDATE blogs SET title = ?, content = ? WHERE id = ?",
        [updatedBlog.title, updatedBlog.content, blogId],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.send("Error updating blog");
            }

            res.redirect(`/blogs/${blogId}`);
        }
    );
});


// Delete blog (with comments handling)
app.post("/blogs/:id/delete", (req, res) => {
    const blogId = req.params.id;

    // First delete comments (MySQL dont allows us to delete blogs directly first we have to delete the comments associated to it)--maintaining referential integrity
    db.query(
        "DELETE FROM comments WHERE blog_id = ?",
        [blogId],
        (err) => {
            if (err) {
                console.log(err);
                return res.send("Error deleting comments");
            }

            // Then delete blog
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


// Create new blog
app.post("/blogs", (req, res) => {
    const newBlog = {
        title: req.body["title"],
        content: req.body["content"],
        user_id: parseInt(req.body["user_id"])
    };

    db.query(
        "INSERT INTO blogs (title, content, user_id) VALUES (?, ?, ?)",
        [newBlog.title, newBlog.content, newBlog.user_id],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.send("Error inserting Blog");
            }

            res.redirect("/");
        }
    );
});


//SERVER 

app.listen(port, () => {
    console.log(`Server is running on port ${3000}.`);
});


//DATABASE 

//blogs(id, title, content, user_id) , users(id, name), comments(id,blog_id,user_id,content)

const db = mysql.createConnection({
    host: process.env.DB_HOST,       // From .env
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.log("DB connection failed", err);
    } else {
        console.log("Connected to MySQL");
    }
});