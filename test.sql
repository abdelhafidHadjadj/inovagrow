



--@block
SELECT * FROM sessions


--@block
SELECT * FROM users
--@block
SELECT * FROM blogs
--@block
SELECT * FROM categories


--@block
SELECT * FROM email_verifications


--@block
DELETE FROM users WHERE id = 'ff597915-07b4-49df-9165-92bafa5bef04';

--@block 
UPDATE users SET role = 'admin'
WHERE id = '1076b66b-7cc6-4b31-b521-c98ec11eeee0' 


--@block
DROP TABLE chat_messages