const db = require('../config/db'); 

const verifyUserCredentials = async (username, password) => {
    try {
        const [results] = await db.execute('SELECT id, password FROM users WHERE username = ?', [username]);
        if (results.length === 0) {
            return null; 
        }
       return results[0];
        
    } catch (error) {
        console.error('Error verifying user credentials:', error);
        throw error;
    }
};

module.exports = verifyUserCredentials;
