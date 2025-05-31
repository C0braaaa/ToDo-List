async function registerUser(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorElement = document.getElementById('signup-error');

    // Reset error message
    errorElement.className = 'error-message';
    errorElement.textContent = '';

    if (password !== confirmPassword) {
        errorElement.textContent = 'Mật khẩu xác nhận không khớp!';
        errorElement.className = 'error-message show';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            showToast('Account registration successful!', 'success');
            switchToLogin();
        } else {
            errorElement.textContent = data.message || 'Đăng ký thất bại!';
            errorElement.className = 'error-message show';
        }
    } catch (error) {
        console.error('Error:', error);
        errorElement.textContent = 'Có lỗi xảy ra khi đăng ký!';
        errorElement.className = 'error-message show';
    }
}

// Login function
async function loginUser(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorElement = document.getElementById('login-error');

    // Reset error message
    errorElement.className = 'error-message';
    errorElement.textContent = '';

    try {
        const response = await fetch('http://localhost:3000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();
        console.log('Login response:', data); // For debugging
        
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data.user));
            closeLoginModal();
            showToast('Login successful!', 'success');
            updateUserInterface(data.user);
            closeLoginModal();
            await loadTasks();
        } else {
            errorElement.textContent = data.message;
            errorElement.className = 'error-message show';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorElement.textContent = 'Có lỗi xảy ra khi đăng nhập!';
        errorElement.className = 'error-message show';
    }
}

function updateUserInterface(user) {
    const userDropdown = document.querySelector('.user-dropdown');
    userDropdown.innerHTML = `
        <div class="user-welcome">Welcome ${user.username}</div>
        <div class="user-dropdown-content">
            <a class="change-pass" href="javascript:void(0)" onclick="openChangepassModal()">
                <img src="../assets/changePass.png" alt="">Change Pass</a>
            <a class="logout" href="javascript:void(0)" onclick="logout()">
                <img src="../assets/logOut.png" alt="">Log Out</a>
        </div>
    `;
}

function logout() {
    localStorage.removeItem('user');
    location.reload();
}

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openSignupModal() {
    document.getElementById('signupModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeSignupModal() {
    document.getElementById('signupModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openChangepassModal(){
    document.getElementById('changePassModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeChangepassModal(){
    document.getElementById('changePassModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}
// Switch between modals
function switchToSignup() {
    closeLoginModal();
    openSignupModal();
}

function switchToLogin() {
    closeSignupModal(); 
    openLoginModal();
}

// Kiểm tra user đã đăng nhập khi trang load
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        updateUserInterface(user);
    }
});

async function changePassword(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;
    const errorElement = document.getElementById('changepass-error');

    // Reset error message
    errorElement.className = 'error-message';
    errorElement.textContent = '';

    // Kiểm tra mật khẩu mới và xác nhận
    if (newPassword !== confirmNewPassword) {
        errorElement.textContent = 'Mật khẩu mới xác nhận không khớp!';
        errorElement.className = 'error-message show';
        return;
    }

    // Lấy email từ localStorage để định danh user
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.email) {
        errorElement.textContent = 'Vui lòng đăng nhập lại!';
        errorElement.className = 'error-message show';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/users/change-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: user.email,
                currentPassword,
                newPassword
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            showToast('Password changed successfully!', 'success');
            closeChangepassModal();
            loadTasks(); // Reload tasks to reflect changes
        } else {
            errorElement.textContent = data.message || 'Đổi mật khẩu thất bại!';
            errorElement.className = 'error-message show';
        }
    } catch (error) {
        console.error('Error:', error);
        errorElement.textContent = 'Có lỗi xảy ra khi đổi mật khẩu!';
        errorElement.className = 'error-message show';
    }
}

// Add event listener for change password form
document.getElementById('changePasswordForm').addEventListener('submit', changePassword);
function togglePassword(imgElement) {
    const input = imgElement.previousElementSibling;
    const isHidden = input.type === "password";

    input.type = isHidden ? "text" : "password";
    imgElement.src = isHidden ? "../assets/openeye.png" : "../assets/closeEys.png";
}