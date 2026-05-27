-- Toy Story Fan Site Database Schema
-- Run this in your MySQL/MariaDB server

CREATE DATABASE IF NOT EXISTS toy_story_fan_site;
USE toy_story_fan_site;

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL DEFAULT NULL
);

-- 2. Movies Table
CREATE TABLE IF NOT EXISTS movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    release_year INT NOT NULL,
    runtime_minutes INT,
    rating VARCHAR(10), -- e.g., "G", "PG"
    tagline TEXT,
    poster_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Characters Table
CREATE TABLE IF NOT EXISTS characters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role_title VARCHAR(100), -- e.g., "Sheriff", "Space Ranger"
    quote TEXT,
    description TEXT, -- The short description replacing badges
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Search Logs (for the "Search & Logs" feature)
CREATE TABLE IF NOT EXISTS search_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    search_term VARCHAR(100) NOT NULL,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45)
);

-- ==========================================
-- SEED DATA (Initial Content)
-- ==========================================

-- Insert Default Admin (Username: admin, Password: admin123)
-- Hash generated via PHP: password_hash('admin123', PASSWORD_DEFAULT)
INSERT INTO admins (username, password_hash) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert Movies
INSERT INTO movies (title, release_year, runtime_minutes, rating, tagline, poster_url) VALUES
('Toy Story', 1995, 81, 'G', 'The adventure takes off!', 'https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg'),
('Toy Story 2', 1999, 92, 'G', 'The toys are back in town.', 'https://image.tmdb.org/t/p/w500/eVGu0zsezaSCuwinjUo8j2ALklt.jpg'),
('Toy Story 3', 2010, 103, 'G', 'No toy gets left behind.', 'https://image.tmdb.org/t/p/w500/AbbXspMOwdvwWZgVN0nabZq03Ec.jpg'),
('Toy Story 4', 2019, 100, 'G', 'Get Ready to Hit the Road.', 'https://image.tmdb.org/t/p/w500/w9kR8qbmQ01HwnvK4alvnQ2ca0L.jpg');

-- Insert Characters
INSERT INTO characters (name, role_title, quote, description, avatar_url) VALUES
('Woody', 'Sheriff of the Wild West', "There's a snake in my boot!", 'A pull-string cowboy doll who is Andy\'s favorite toy and the natural leader of the group. Loyal and brave.', 'https://image.tmdb.org/t/p/w500/ewlEoe5v3xT4b79Y6FwB5qC4tN.jpg'),
('Buzz Lightyear', 'Space Ranger', 'To infinity... and beyond!', 'A former space action figure who initially didn\'t realize he was a toy. Now a confident hero and Woody\'s best friend.', 'https://image.tmdb.org/t/p/w500/2d7lByUlxlS7b7m2T2t2t2t2t2t.jpg'),
('Jessie', 'Cowgirl', 'When I was on the shelf, I never thought...', 'A spirited yodeling cowgirl with a tragic past. She brings energy and heart to the gang.', 'https://image.tmdb.org/t/p/w500/j6yG7b7b7b7b7b7b7b7b7b7b7b.jpg'),
('Mr. Potato Head', 'Spud Man', 'Oh, look at me, I\'m Picasso!', 'A sarcastic potato with detachable parts. He can be grumpy but deeply cares for Mrs. Potato Head.', 'https://image.tmdb.org/t/p/w500/k6k6k6k6k6k6k6k6k6k6k6k6k6.jpg'),
('Rex', 'Anxious Dinosaur', 'I don\'t think I can do this!', 'A plastic Tyrannosaurus Rex with a gentle heart and a constant fear of not being scary enough.', 'https://image.tmdb.org/t/p/w500/r5r5r5r5r5r5r5r5r5r5r5r5r5.jpg'),
('Hamm', 'Wisecracking Piggy Bank', 'Let\'s see what\'s on TV.', 'A cynical piggy bank who loves games and cracking jokes. He\'s the voice of reason (sometimes).', 'https://image.tmdb.org/t/p/w500/h4h4h4h4h4h4h4h4h4h4h4h4h4.jpg');
