document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');
    
    // Reset messages
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';
    
    // Validation
    if (password !== confirmPassword) {
        errorMsg.textContent = 'Passwords do not match!';
        errorMsg.style.display = 'block';
        return;
    }
    
    if (password.length < 6) {
        errorMsg.textContent = 'Password must be at least 6 characters!';
        errorMsg.style.display = 'block';
        return;
    }
    
    // Check if username already exists
    const users = JSON.parse(localStorage.getItem('nepartha_users') || '[]');
    const userExists = users.find(u => u.username === username);
    
    if (userExists) {
        errorMsg.textContent = 'Username already exists!';
        errorMsg.style.display = 'block';
        return;
    }
    
    // Save user to localStorage
    const newUser = {
        fullname: fullname,
        email: email,
        username: username,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('nepartha_users', JSON.stringify(users));
    
    // Show success message
    successMsg.textContent = 'Account created successfully! Redirecting to login...';
    successMsg.style.display = 'block';
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
});