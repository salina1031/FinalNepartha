/**
 * auth.js — NepArtha shared auth utilities
 * Load this FIRST before dashboard.js, expenses.js, etc.
 * Provides: API_URL, authFetch, getToken, getSession, initPage, logout
 */

const API_URL = 'http://localhost:5000/api';

// ─── Token / Session helpers ──────────────────────────────────────────────────

function getToken() {
    return localStorage.getItem('nepartha_token') ||
           sessionStorage.getItem('nepartha_token');
}

function getSession() {
    const raw = localStorage.getItem('nepartha_session') ||
                sessionStorage.getItem('nepartha_session');
    try { return raw ? JSON.parse(raw) : null; }
    catch { return null; }
}

function clearSession() {
    ['nepartha_token', 'nepartha_session'].forEach(k => {
        localStorage.removeItem(k);
        sessionStorage.removeItem(k);
    });
}

// ─── Authenticated fetch ──────────────────────────────────────────────────────

/**
 * Wrapper around fetch() that:
 *  - Attaches Authorization: Bearer <token>
 *  - Adds Content-Type: application/json only when body is present
 *  - Redirects to login on 401
 *  - Returns null if unauthenticated (already redirected)
 */
async function authFetch(url, options = {}) {
    const token = getToken();
    if (!token) {
        redirectToLogin();
        return null;
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        ...(options.headers || {})
    };

    // Only set Content-Type when we're sending a body
    if (options.body) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        clearSession();
        redirectToLogin();
        return null;
    }

    return response;
}

// ─── Guards ───────────────────────────────────────────────────────────────────

function checkAuth() {
    const token   = getToken();
    const session = getSession();
    if (!token || !session) {
        redirectToLogin();
        return null;
    }
    return session;
}

function redirectToLogin() {
    window.location.href = 'login.html';
}

async function logout() {
    const token = getToken();
    if (token) {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method:  'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (_) {}
    }
    clearSession();
    redirectToLogin();
}

// ─── Page bootstrap ───────────────────────────────────────────────────────────

/**
 * Call at the top of every protected page's DOMContentLoaded.
 * - Redirects to login if no token/session found
 * - Fills #userName with user's full name
 * - Wires all [data-action="logout"] buttons
 * Returns session object or null.
 */
function initPage() {
    const session = checkAuth();
    if (!session) return null;

    const el = document.getElementById('userName');
    if (el) el.textContent = session.fullname || session.username;

    document.querySelectorAll('[data-action="logout"]').forEach(btn => {
        btn.addEventListener('click', logout);
    });

    return session;
}