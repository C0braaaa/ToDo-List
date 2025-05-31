const connection = require('../config/database');

const TaskModel = {
    create: (userId, taskText) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO Tasks (user_id, task_text) VALUES (?, ?)';
            connection.query(query, [userId, taskText], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },

    getAllByUserId: (userId) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Tasks WHERE user_id = ? ORDER BY created_at DESC';
            connection.query(query, [userId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },

    updateStatus: (taskId, isFinished) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE Tasks SET is_finished = ? WHERE task_id = ?';
            connection.query(query, [isFinished, taskId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },

    delete: (taskId) => {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM Tasks WHERE task_id = ?';
            connection.query(query, [taskId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },

    // getById: (taskId) => {
    //     return new Promise((resolve, reject) => {
    //         const query = 'SELECT * FROM Tasks WHERE task_id = ?';
    //         connection.query(query, [taskId], (error, results) => {
    //             if (error) {
    //                 reject(error);
    //             } else {
    //                 resolve(results[0]);
    //             }
    //         });
    //     });
    // }
};

module.exports = TaskModel;