// signup.js — NepArtha v2 (backend-registered)

const API_URL = 'http://localhost:5000/api';

document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const fullname        = document.getElementById('fullname').value.trim();
    const email           = document.getElementById('email').value.trim();
    const username        = document.getElementById('username').value.trim();
    const password        = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorEl         = document.getElementById('errorMsg');
    const successEl       = document.getElementById('successMsg');
    const btn             = this.querySelector('button[type="submit"]');

    errorEl.style.display   = 'none';
    successEl.style.display = 'none';

    // Client-side validation
    if (password !== confirmPassword) {
        errorEl.textContent   = 'Passwords do not match!';
        errorEl.style.display = 'block';
        return;
    }
    if (password.length < 6) {
        errorEl.textContent   = 'Password must be at least 6 characters!';
        errorEl.style.display = 'block';
        return;
    }

    btn.textContent = 'Creating account…';
    btn.disabled    = true;

    try {
        const res  = await fetch(`${API_URL}/auth/register`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ fullname, email, username, password })
        });
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        successEl.textContent = 'Account created successfully! Redirecting...';
successEl.style.display = 'block';

setTimeout(() => {
    window.location.href = 'login.html';
}, 1500);

    } catch (err) {
        errorEl.textContent   = err.message;
        errorEl.style.display = 'block';
        btn.textContent       = 'Sign Up';
        btn.disabled          = false;
    }
});
