// login.js — NepArtha v2

const API_URL = 'https://finalnepartha-2.onrender.com/api';

// ─── Page load — fill saved username if remember me was checked ───────────────

document.addEventListener('DOMContentLoaded', function () {
    const savedUsername = localStorage.getItem('nepartha_remembered_user');

    if (savedUsername) {
        document.getElementById('username').value   = savedUsername;
        document.getElementById('remember').checked = true;
        document.getElementById('password').focus(); // cursor password मा
    }
});

// ─── Login submit ─────────────────────────────────────────────────────────────

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    const errorEl  = document.getElementById('errorMsg');
    const btn      = this.querySelector('button[type="submit"]');

    errorEl.style.display = 'none';
    btn.textContent = 'Logging in…';
    btn.disabled    = true;

    try {
        const res  = await fetch(`${API_URL}/auth/login`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Remember me — save ki tha cclear garxxa 
        if (remember) {
            localStorage.setItem('nepartha_remembered_user', username);
        } else {
            localStorage.removeItem('nepartha_remembered_user');
        }

        // Token + session save
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('nepartha_token',   data.token);
        storage.setItem('nepartha_session', JSON.stringify({
            user_id:  data.user_id,
            username: data.username,
            fullname: data.fullname,
            email:    data.email
        }));

        window.location.href = 'index.html';

    } catch (err) {
        errorEl.textContent   = err.message;
        errorEl.style.display = 'block';
        btn.textContent       = 'LogIn';
        btn.disabled          = false;
    }
});