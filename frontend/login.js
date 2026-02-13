
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.style.display = 'none';
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('nepartha_users') || '[]');
    
    // Find matching user
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Store logged in user session
        const session = {
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            loginTime: new Date().toISOString()
        };
        
        if (remember) {
            localStorage.setItem('nepartha_session', JSON.stringify(session));
        } else {
            sessionStorage.setItem('nepartha_session', JSON.stringify(session));
        }
        
        // Redirect to dashboard
        window.location.href = 'index.html';
    } else {
        errorMsg.textContent = 'Invalid username or password!';
        errorMsg.style.display = 'block';
    }
});