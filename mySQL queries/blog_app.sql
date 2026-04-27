CREATE database blog_app;

USE blog_app;

//blogs(id, title, content, user_id) , users(id, name), comments(id,blog_id,user_id,content)


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
    FOREIGN KEY (user_id) REFERENCES users(id),
    Curr_date TIMESTAMP;
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


//triggers

CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


DELIMITER $$
CREATE TRIGGER after_blog_insert
AFTER INSERT ON blogs
FOR EACH ROW
BEGIN
    INSERT INTO logs (action, description)
    VALUES (
        'CREATE_BLOG',
        CONCAT('New blog created with id ', NEW.id, ' by user ', NEW.user_id)
    );
END $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER after_blog_delete
AFTER DELETE ON blogs
FOR EACH ROW
BEGIN
    INSERT INTO logs (action, description)
    VALUES (
        'DELETE_BLOG',
        CONCAT('Blog deleted with id ', OLD.id)
    );
END $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER after_comment_insert
AFTER INSERT ON comments
FOR EACH ROW
BEGIN
    INSERT INTO logs (action, description)
    VALUES (
        'ADD_COMMENT',
        CONCAT('Comment added on blog ', NEW.blog_id, ' by user ', NEW.user_id)
    );
END $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER after_blog_update
AFTER UPDATE ON blogs
FOR EACH ROW
BEGIN
    INSERT INTO logs (action, description)
    VALUES (
        'UPDATE_BLOG',
        CONCAT('Blog with ID ', NEW.id, ' was edited')
    );
END $$
DELIMITER ;
