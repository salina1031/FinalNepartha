const API_URL = 'https://finalnepartha-2.onrender.com/api';

document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const fullname        = document.getElementById('fullname').value.trim();
    const email           = document.getElementById('email').value.trim();
    const username        = document.getElementById('username').value.trim();
    const password        = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorEl         = document.getElementById('errorMsg');
    const successEl       = document.getElementById('successMsg');
    const confirmErr      = document.getElementById('confirmError');
    const passwordErr     = document.getElementById('passwordError');
    const btn             = this.querySelector('button[type="submit"]');

    // सबै error clear गर्नुस्
    clearErrors();

    // Validation
    let hasError = false;

    if (!fullname) {
        showFieldError('fullnameError', 'Full name is required');
        hasError = true;
    }
    if (!email) {
        showFieldError('emailError', 'Email is required');
        hasError = true;
    }
    if (!username) {
        showFieldError('usernameError', 'Username is required');
        hasError = true;
    }
    if (password.length < 6) {
        showFieldError('passwordError', 'Password must be at least 6 characters');
        hasError = true;
    }
    if (password !== confirmPassword) {
        showFieldError('confirmError', 'Passwords do not match');
        hasError = true;
    }

    if (hasError) return;

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

        successEl.textContent   = 'Account created successfully! Redirecting...';
        successEl.style.display = 'block';

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);

    } catch (err) {
        errorEl.textContent   =  err.message;
        errorEl.style.display = 'block';
        btn.textContent       = 'Sign Up';
        btn.disabled          = false;
    }
});

function showFieldError(id, message) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent =  message;
        el.style.display = 'block';
    }
}

function clearErrors() {
    ['fullnameError','emailError','usernameError','passwordError','confirmError'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.textContent = ''; el.style.display = 'none'; }
    });
    document.getElementById('errorMsg').style.display   = 'none';
    document.getElementById('successMsg').style.display = 'none';
}