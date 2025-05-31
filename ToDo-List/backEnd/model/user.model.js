const connection = require('../config/database');

const UserModel = {
    create: (username, email, password) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)';
            connection.query(query, [username, email, password], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },

    findByEmail: (email) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Users WHERE email = ?';
            connection.query(query, [email], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.length > 0 ? results[0] : null);
                }
            });
        });
    },

    updatePassword: (userId, newPassword) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE Users SET password = ? WHERE user_id = ?';
            connection.query(query, [newPassword, userId], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    }
};

module.exports = UserModel;