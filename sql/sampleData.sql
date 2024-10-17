-- Add some sample users
INSERT INTO users (username, password) VALUES 
('user1', 'hashed_password_1'), 
('user2', 'hashed_password_2');

-- Add some sample reports
INSERT INTO reports (name, embed_url) VALUES 
('Sales Dashboard', 'https://example.com/embed/sales'),
('Marketing Dashboard', 'https://example.com/embed/marketing');

-- Assign reports to users
INSERT INTO user_report_access (user_id, report_id) VALUES 
(1, 1), 
(1, 2), 
(2, 1);
