const UserModel = require('../model/user.model');
const bcrypt = require('bcrypt');

const UserController = {
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Kiểm tra dữ liệu đầu vào
            if (!username || !email || !password) {
                return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
            }

            // Lưu user vào database
            await UserModel.create(username, email, password);

            res.status(201).json({ message: 'Đăng ký thành công' });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Tên đăng nhập hoặc email đã tồn tại' });
            }
            res.status(500).json({ message: 'Lỗi đăng ký tài khoản' });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log('Login attempt:', { email, password }); // Debug log

            if (!email || !password) {
                return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
            }

            const user = await UserModel.findByEmail(email);
            console.log('Found user:', user); // Debug log
            
            if (!user) {
                return res.status(401).json({ message: 'Email không tồn tại' });
            }

            if (user.password !== password) {
                return res.status(401).json({ message: 'Mật khẩu không chính xác' });
            }

            res.status(200).json({ 
                message: 'Đăng nhập thành công',
                user: {
                    username: user.username,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Lỗi đăng nhập' });
        }
    },

    changePassword: async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;

        // Tìm user trong database
        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Kiểm tra mật khẩu hiện tại trong database
        if (currentPassword !== user.password) {
            return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
        }

        // Cập nhật mật khẩu mới
        await UserModel.updatePassword(user.user_id, newPassword);

        res.status(200).json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Lỗi khi đổi mật khẩu' });
    }
}
};

module.exports = UserController;