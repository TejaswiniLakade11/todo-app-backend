const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.execute(
        'INSERT INTO users (username, password) VALUES (?, ?)', 
        [username, hashedPassword]
      );
      res.status(201).send({ message: 'User registered successfully!' });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).send({ error: 'An error occurred during registration.' });
    }
  };

  exports.login = async (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt: ${username}`);
  
    try {
      const [userRows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
      console.log(`User rows: ${JSON.stringify(userRows)}`);
      const user = userRows[0];
      console.log(user.password)
  
      if (!user) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      console.log(`Password valid: ${isPasswordValid}`);
  
      if (!isPasswordValid) {
        console.log('Invalid password');
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '3h' });
      console.log(`Token: ${token}`);
      res.json({ token });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Error logging in' });
    }
  };