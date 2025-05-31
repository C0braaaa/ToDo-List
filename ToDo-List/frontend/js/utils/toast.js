function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Add icon based on type
    const icon = type === 'success' ? '✓' : '✕';
    
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Remove toast after animation
    setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
        toast.remove();
    }, 500);
}, 3000);
}