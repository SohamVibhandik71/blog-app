CREATE database blog_app;

USE blog_app;


CREATE TABLE users(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE comments(
	id INT AUTO_INCREMENT PRIMARY KEY,
    blog_id INT,
    user_id INT,
    content TEXT,
    FOREIGN KEY (blog_id) REFERENCES blogs(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (name) VALUES 
('Soham'),
('Aditya'),
('Gaurish');

INSERT INTO blogs (title, content, user_id) VALUES
('AI', 'AI can never replace humans!', 1),
('Global Warming', 'Important issue', 2);

SELECT * FROM users;
SELECT * FROM blogs;

