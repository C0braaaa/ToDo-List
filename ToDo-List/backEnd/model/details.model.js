const connection = require('../config/database');

const DetailModel = {
    getByTaskId: (taskId) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Details WHERE task_id = ?';
            connection.query(query, [taskId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0]); // Return first matching record
                }
            });
        });
    },

    create: (taskId, details) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO Details (task_id, tasks_name, start_date, end_date, description)
                VALUES (?, ?, ?, ?, ?)
            `;
            connection.query(query, 
                [taskId, details.tasks_name, details.start_date, details.end_date, details.description],
                (error, results) => {
                    if (error) reject(error);
                    else resolve(results);
                }
            );
        });
    },

    update: (taskId, details) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE Details 
                SET tasks_name = ?, start_date = ?, end_date = ?, description = ?
                WHERE task_id = ?
            `;
            connection.query(query, 
                [details.tasks_name, details.start_date, details.end_date, details.description, taskId],
                (error, results) => {
                    if (error) reject(error);
                    else resolve(results);
                }
            );
        });
    }
};

module.exports = DetailModel;