const DetailModel = require('../model/details.model');
const connection = require('../config/database');

const DetailController = {
    getTaskDetails: async (req, res) => {
        try {
            const taskId = req.params.taskId;
            const details = await DetailModel.getByTaskId(taskId);
            res.json(details || {});
        } catch (error) {
            console.error('Get details error:', error);
            res.status(500).json({ message: 'Error getting task details' });
        }
    },

    updateTaskDetails: async (req, res) => {
        try {
            const taskId = req.params.taskId;
            const details = req.body;

            const existingDetails = await DetailModel.getByTaskId(taskId);

            if (existingDetails) {
                await DetailModel.update(taskId, details);
            } else {
                await DetailModel.create(taskId, details);
            }

            // Update task_text in Tasks table
            const updateTaskQuery = 'UPDATE Tasks SET task_text = ? WHERE task_id = ?';
            await new Promise((resolve, reject) => {
                connection.query(updateTaskQuery, [details.tasks_name, taskId], (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });

            res.json({ message: 'Task details updated successfully' });
        } catch (error) {
            console.error('Update details error:', error);
            res.status(500).json({ message: 'Error updating task details' });
        }
    }
};

module.exports = DetailController;