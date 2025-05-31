// Add a new task
async function addTask() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        showToast('Please login to add task', 'error');
        // alert('Vui lòng đăng nhập để thêm task');
        openLoginModal();
        return;
    }

    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (!taskText) {
        showToast('Please enter a task', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/tasks/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: user.email, // Thay userId bằng email
                taskText: taskText
            })
        });

        const data = await response.json();

        if (response.ok) {
            taskInput.value = '';
            await loadTasks();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi thêm task');
    }
}

async function loadTasks() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
        const response = await fetch(`http://localhost:3000/api/tasks/user/${user.email}`);
        const tasks = await response.json();

        const todoList = document.getElementById('todoList');
        todoList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `todo-item ${task.is_finished ? 'completed' : ''}`;
            li.innerHTML = `
                <span>${task.task_text}</span>
                <button class="finish-btn" 
                    onclick="updateTaskStatus(${task.task_id}, ${!task.is_finished})">
                    ${task.is_finished ? 'Unfinish' : 'Finish'}
                </button>
                <button class="edit-btn" onclick="editTask(${task.task_id})">Edit</button>
                <button class="view-btn" onclick="viewTask(${task.task_id})">View</button>
                <button class="delete-btn" onclick="deleteTask(${task.task_id})">Delete</button>
            `;
            todoList.appendChild(li);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}
document.addEventListener('DOMContentLoaded', loadTasks);
// Delete a task
let taskIdToDelete = null;

async function deleteTask(taskId) {
    taskIdToDelete = taskId;
    const deleteDialog = document.getElementById('deleteDialog');
    deleteDialog.style.display = 'flex';
}

async function confirmDelete() {
    try {
        const response = await fetch(`http://localhost:3000/api/tasks/${taskIdToDelete}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            closeDeleteDialog();
            loadTasks();
            showToast('Delete task success!', 'success');
        } else {
            const data = await response.json();
            showToast(data.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Có lỗi xảy ra khi xóa task', 'error');
    }
}

function closeDeleteDialog() {
    const deleteDialog = document.getElementById('deleteDialog');
    deleteDialog.style.display = 'none';
    taskIdToDelete = null;
}

// Edit task - Show edit modal
async function editTask(taskId) {
    try {
        // Fetch task details from database
        const detailsResponse = await fetch(`http://localhost:3000/api/details/task/${taskId}`);
        const details = await detailsResponse.json();

        // Get modal elements
        const modal = document.getElementById('editModal');
        const nameInput = document.getElementById('editNameTask');
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        const descriptionInput = document.getElementById('description');

        // Fill form with existing data if available
        if (details) {
            nameInput.value = details.tasks_name || '';
            startDateInput.value = details.start_date ? new Date(details.start_date).toISOString().split('T')[0] : '';
            endDateInput.value = details.end_date ? new Date(details.end_date).toISOString().split('T')[0] : '';
            descriptionInput.value = details.description || '';
        }

        // Store taskId for save function
        modal.dataset.taskId = taskId;

        // Show modal
        modal.style.display = 'flex';
    } catch (error) {
        console.error('Error:', error);
        showToast('Error loading task details', 'error');
    }
}

async function saveTaskDetails(event) {
    event.preventDefault();
    
    const modal = document.getElementById('editModal');
    const taskId = modal.dataset.taskId;
    
    const details = {
        tasks_name: document.getElementById('editNameTask').value,
        start_date: document.getElementById('startDate').value || null,
        end_date: document.getElementById('endDate').value || null,
        description: document.getElementById('description').value
    };

    try {
        const response = await fetch(`http://localhost:3000/api/details/task/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(details)
        });

        if (response.ok) {
            showToast('Task updated successfully', 'success');
            closeEditModal();
            loadTasks(); // Refresh task list
        } else {
            const data = await response.json();
            showToast(data.message || 'Error updating task', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error updating task', 'error');
    }
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
    document.getElementById('editTaskForm').reset();
}

// Event listeners for edit modal
document.querySelector('#editModal .close-btn-edit').onclick = closeEditModal;
document.querySelector('#editModal .cancel-btn').onclick = closeEditModal;

async function viewTask(taskId) {
    try {
        const response = await fetch(`http://localhost:3000/api/details/task/${taskId}`);
        const details = await response.json();

        // Format dates to only show YYYY-MM-DD
        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            return new Date(dateString).toISOString().split('T')[0];
        };

        // Điền thông tin vào modal
        document.getElementById('viewTaskName').innerText = details.tasks_name || 'N/A';
        document.getElementById('viewStartDate').innerText = formatDate(details.start_date);
        document.getElementById('viewEndDate').innerText = formatDate(details.end_date);
        document.getElementById('viewDescription').innerText = details.description || 'N/A';

        // Mở modal
        const modal = document.getElementById('viewModal');
        modal.style.display = 'flex';
    } catch (error) {
        console.error('Error loading task details:', error);
        showToast('Error loading task details', 'error');
    }
}
function closeViewModal() {
    const modal = document.getElementById('viewModal');
    modal.style.display = 'none';
}

document.querySelector('#viewModal .close-btn-view').onclick = closeViewModal;
document.querySelector('#viewModal .cancel-btn').onclick = closeViewModal;

// Close modal when clicking outside
window.onclick = function(event) {
    const editModal = document.getElementById('editModal');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const changePassModal = document.getElementById('changePassModal');
    const deleteDialog = document.getElementById('deleteDialog');
    const viewModal = document.getElementById('viewModal');
    if (event.target === editModal) {
        closeEditModal();
    }
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === signupModal) {
        closeSignupModal();
    }
    if (event.target === changePassModal) {
        closeChangepassModal();
    }
    if (event.target === deleteDialog) {
        closeDeleteDialog();
    }
    if (event.target === viewModal) {
        closeViewModal();
    }
}

// Initial render
loadTasks();

// Add task on Enter key press
document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Load tasks when page loads and after login
document.addEventListener('DOMContentLoaded', loadTasks);

// Thêm hàm updateTaskStatus
async function updateTaskStatus(taskId, isFinished) {
    try {
        const response = await fetch('http://localhost:3000/api/tasks/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                taskId,
                isFinished
            })
        });

        if (response.ok) {
            loadTasks(); // Tải lại danh sách sau khi cập nhật
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('editTaskForm').addEventListener('submit', saveTaskDetails);
});