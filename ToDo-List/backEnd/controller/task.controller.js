const TaskModel = require('../model/task.model');
const UserModel = require('../model/user.model');

const TaskController = {
    createTask: async (req, res) => {
        try {
            const { email, taskText } = req.body;

            if (!email || !taskText) {
                return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
            }

            // Lấy user_id từ database dựa vào email
            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng' });
            }

            await TaskModel.create(user.user_id, taskText);
            res.status(201).json({ message: 'Thêm task thành công' });
        } catch (error) {
            console.error('Create task error:', error);
            res.status(500).json({ message: 'Lỗi khi thêm task' });
        }
    },

    getTasks: async (req, res) => {
        try {
            const email = req.params.email;
            
            // Lấy user_id từ database
            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng' });
            }

            const tasks = await TaskModel.getAllByUserId(user.user_id);
            res.status(200).json(tasks);
        } catch (error) {
            console.error('Get tasks error:', error);
            res.status(500).json({ message: 'Lỗi khi lấy danh sách task' });
        }
    },

    updateTaskStatus: async (req, res) => {
        try {
            const { taskId, isFinished } = req.body;
            await TaskModel.updateStatus(taskId, isFinished);
            res.status(200).json({ message: 'Cập nhật trạng thái thành công' });
        } catch (error) {
            console.error('Update task error:', error);
            res.status(500).json({ message: 'Lỗi khi cập nhật task' });
        }
    },

    deleteTask: async (req, res) => {
        try {
            const taskId = req.params.taskId;
            await TaskModel.delete(taskId);
            res.status(200).json({ message: 'Xóa task thành công' });
        } catch (error) {
            console.error('Delete task error:', error);
            res.status(500).json({ message: 'Lỗi khi xóa task' });
        }
    },

    // getTaskById: async (req, res) => {
    //     try {
    //         const taskId = req.params.taskId;
    //         const task = await TaskModel.getById(taskId);
            
    //         if (!task) {
    //             return res.status(404).json({ message: 'Không tìm thấy task' });
    //         }

    //         res.status(200).json(task);
    //     } catch (error) {
    //         console.error('Get task by id error:', error);
    //         res.status(500).json({ message: 'Lỗi khi lấy thông tin task' });
    //     }
    // }
};

module.exports = TaskController;