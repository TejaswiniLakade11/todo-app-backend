const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const verifyUserCredentials = require('./verifyUserCredentials');
const your_secret_key = 'your_secret_key';

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
        const user = await verifyUserCredentials(username, password);

        if (!user) {
            console.log('Invalid credentials: User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(`Password valid: ${isPasswordValid}`);
        
        if (!isPasswordValid) {
            console.log('Invalid password');
            return res.status(401).json({ message: 'Invalid password' });
        }

        const userId = user.id;
        const token = jwt.sign({ userId }, your_secret_key, { expiresIn: '9h' });
        console.log(`Token: ${token}`);
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Error during login' });
    }
};
