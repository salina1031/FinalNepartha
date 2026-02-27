from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib
import uuid
import os
from datetime import datetime

app = Flask(__name__)

# ─── CORS — allow all origins for local development ───────────────────────────
CORS(app, resources={
    r'/api/*': {
        'origins': ['http://localhost:5500', 'http://127.0.0.1:5500',
                    'http://localhost:5173', 'http://127.0.0.1:5173',
                    'http://localhost:3000', 'http://127.0.0.1:3000',
                    'https://final-nepartha.vercel.app',
                    'null'],
        'methods': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        'allow_headers': ['Content-Type', 'Authorization']
    }
})

@app.after_request
def after_request(response):
    origin = request.headers.get('Origin', '')
    response.headers['Access-Control-Allow-Origin']  = origin or '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    return response

DATABASE = 'nepartha.db'

# ─── DB INIT ──────────────────────────────────────────────────────────────────

def init_db():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()

    # ── Users table ──────────────────────────────────────────────────────────
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            username   TEXT    UNIQUE NOT NULL,
            password   TEXT    NOT NULL,
            fullname   TEXT,
            email      TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # ── Sessions table ───────────────────────────────────────────────────────
    c.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            token      TEXT    PRIMARY KEY,
            user_id    INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    # ── Expenses table — migrate if user_id column missing ───────────────────
    c.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id     INTEGER NOT NULL DEFAULT 1,
            amount      REAL    NOT NULL,
            category    TEXT    NOT NULL,
            description TEXT,
            date        TEXT    NOT NULL,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Add user_id column to expenses if it does not exist (old DB migration)
    existing_cols = [row[1] for row in c.execute("PRAGMA table_info(expenses)").fetchall()]
    if "user_id" not in existing_cols:
        print("[migration] Adding user_id column to expenses table...")
        c.execute("ALTER TABLE expenses ADD COLUMN user_id INTEGER NOT NULL DEFAULT 1")
        print("[migration] Done.")

    # ── Budget table — migrate if user_id column missing ────────────────────
    c.execute('''
        CREATE TABLE IF NOT EXISTS budget (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    INTEGER NOT NULL UNIQUE DEFAULT 1,
            budget     REAL    NOT NULL DEFAULT 15000,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Add user_id column to budget if it does not exist (old DB migration)
    budget_cols = [row[1] for row in c.execute("PRAGMA table_info(budget)").fetchall()]
    if "user_id" not in budget_cols:
        print("[migration] Adding user_id column to budget table...")
        # SQLite cannot add UNIQUE column directly — recreate the table
        c.execute("ALTER TABLE budget RENAME TO budget_old")
        c.execute('''
            CREATE TABLE budget (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id    INTEGER NOT NULL UNIQUE DEFAULT 1,
                budget     REAL    NOT NULL DEFAULT 15000,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        c.execute("INSERT INTO budget (user_id, budget, updated_at) SELECT 1, budget, updated_at FROM budget_old")
        c.execute("DROP TABLE budget_old")
        print("[migration] Done.")

    conn.commit()
    conn.close()
    print("[DB] Initialized / migrated successfully.")

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# ─── AUTH HELPERS ─────────────────────────────────────────────────────────────

def get_current_user_id():
    """Extract user_id from Bearer token, or return None."""
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return None
    token = auth[7:]
    conn = get_db()
    row = conn.execute(
        'SELECT user_id FROM sessions WHERE token = ?', (token,)
    ).fetchone()
    conn.close()
    return row['user_id'] if row else None

def require_auth():
    """Returns (user_id, None) or (None, error_response).
    OPTIONS preflight requests are always passed through."""
    if request.method == 'OPTIONS':
        return None, (jsonify({}), 204)
    uid = get_current_user_id()
    if uid is None:
        return None, (jsonify({'error': 'Unauthorized'}), 401)
    return uid, None

# ─── AUTH ENDPOINTS ───────────────────────────────────────────────────────────

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    password = data.get('password', '')
    fullname = data.get('fullname', '').strip()
    email    = data.get('email', '').strip()

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400

    conn = get_db()
    existing = conn.execute(
        'SELECT id FROM users WHERE username = ?', (username,)
    ).fetchone()
    if existing:
        conn.close()
        return jsonify({'error': 'Username already exists'}), 409

    hashed = hash_password(password)
    conn.execute(
        'INSERT INTO users (username, password, fullname, email) VALUES (?, ?, ?, ?)',
        (username, hashed, fullname, email)
    )
    conn.commit()
    conn.close()
    return jsonify({'message': 'Account created successfully'}), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    password = data.get('password', '')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    hashed = hash_password(password)
    conn = get_db()

    # Check if user exists
    user_exists = conn.execute('SELECT id FROM users WHERE username = ?', (username,)).fetchone()
    if not user_exists:
        conn.close()
        return jsonify({'error': "User '" + username + "' does not exist. Please sign up first."}), 401

    # Check password
    user = conn.execute(
        'SELECT id, fullname, email FROM users WHERE username = ? AND password = ?',
        (username, hashed)
    ).fetchone()

    if not user:
        conn.close()
        return jsonify({'error': 'Incorrect password. Please try again.'}), 401

    token = str(uuid.uuid4())
    conn.execute(
        'INSERT INTO sessions (token, user_id) VALUES (?, ?)',
        (token, user['id'])
    )
    conn.commit()
    conn.close()

    return jsonify({
        'token':    token,
        'user_id':  user['id'],
        'username': username,
        'fullname': user['fullname'],
        'email':    user['email']
    }), 200


@app.route('/api/auth/logout', methods=['POST'])
def logout():
    auth = request.headers.get('Authorization', '')
    if auth.startswith('Bearer '):
        token = auth[7:]
        conn = get_db()
        conn.execute('DELETE FROM sessions WHERE token = ?', (token,))
        conn.commit()
        conn.close()
    return jsonify({'message': 'Logged out'}), 200


@app.route('/api/auth/me', methods=['GET'])
def me():
    uid, err = require_auth()
    if err:
        return err
    conn = get_db()
    user = conn.execute(
        'SELECT id, username, fullname, email FROM users WHERE id = ?', (uid,)
    ).fetchone()
    conn.close()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({
        'id':       user['id'],
        'username': user['username'],
        'fullname': user['fullname'],
        'email':    user['email']
    }), 200

# ─── EXPENSES ─────────────────────────────────────────────────────────────────

@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    uid, err = require_auth()
    if err:
        return err
    conn = get_db()
    rows = conn.execute(
        'SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC', (uid,)
    ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows]), 200


@app.route('/api/expenses/<int:expense_id>', methods=['GET'])
def get_expense(expense_id):
    uid, err = require_auth()
    if err:
        return err
    conn = get_db()
    row = conn.execute(
        'SELECT * FROM expenses WHERE id = ? AND user_id = ?', (expense_id, uid)
    ).fetchone()
    conn.close()
    if not row:
        return jsonify({'error': 'Expense not found'}), 404
    return jsonify(dict(row)), 200


@app.route('/api/expenses', methods=['POST'])
def add_expense():
    uid, err = require_auth()
    if err:
        return err
    data = request.get_json() or {}
    amount      = data.get('amount')
    category    = data.get('category')
    description = data.get('description', '')
    date        = data.get('date')

    if not amount or not category or not date:
        return jsonify({'error': 'Missing required fields'}), 400
    if float(amount) <= 0:
        return jsonify({'error': 'Amount must be greater than 0'}), 400

    conn = get_db()
    cursor = conn.execute(
        'INSERT INTO expenses (user_id, amount, category, description, date) VALUES (?, ?, ?, ?, ?)',
        (uid, float(amount), category, description, date)
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return jsonify({'id': new_id, 'message': 'Expense added successfully'}), 201


@app.route('/api/expenses/<int:expense_id>', methods=['PUT'])
def update_expense(expense_id):
    uid, err = require_auth()
    if err:
        return err
    data = request.get_json() or {}
    amount      = data.get('amount')
    category    = data.get('category')
    description = data.get('description', '')
    date        = data.get('date')

    if not amount or not category or not date:
        return jsonify({'error': 'Missing required fields'}), 400
    if float(amount) <= 0:
        return jsonify({'error': 'Amount must be greater than 0'}), 400

    conn = get_db()
    cursor = conn.execute(
        '''UPDATE expenses SET amount=?, category=?, description=?, date=?
           WHERE id=? AND user_id=?''',
        (float(amount), category, description, date, expense_id, uid)
    )
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        return jsonify({'error': 'Expense not found or access denied'}), 404
    return jsonify({'message': 'Expense updated successfully'}), 200


@app.route('/api/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    uid, err = require_auth()
    if err:
        return err
    conn = get_db()
    cursor = conn.execute(
        'DELETE FROM expenses WHERE id = ? AND user_id = ?', (expense_id, uid)
    )
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        return jsonify({'error': 'Expense not found or access denied'}), 404
    return jsonify({'message': 'Expense deleted successfully'}), 200

# ─── BUDGET ───────────────────────────────────────────────────────────────────

@app.route('/api/budget', methods=['GET', 'OPTIONS'])
def get_budget():
    uid, err = require_auth()
    if err:
        return err          # handles OPTIONS (204) and Unauthorized (401)
    if uid is None:
        return jsonify({}), 204
    conn = get_db()
    row = conn.execute(
        'SELECT budget FROM budget WHERE user_id = ?', (uid,)
    ).fetchone()
    conn.close()
    return jsonify({'budget': row['budget'] if row else 15000}), 200


@app.route('/api/budget', methods=['POST', 'OPTIONS'])
def set_budget():
    uid, err = require_auth()
    if err:
        return err          # handles OPTIONS (204) and Unauthorized (401)
    if uid is None:
        return jsonify({}), 204
    data = request.get_json() or {}
    budget = data.get('budget')
    if not budget or float(budget) <= 0:
        return jsonify({'error': 'Valid budget amount required'}), 400

    conn = get_db()
    conn.execute(
        '''INSERT INTO budget (user_id, budget) VALUES (?, ?)
           ON CONFLICT(user_id) DO UPDATE SET budget=excluded.budget, updated_at=CURRENT_TIMESTAMP''',
        (uid, float(budget))
    )
    conn.commit()
    conn.close()
    return jsonify({'message': 'Budget updated successfully'}), 200

# ─── STATS ────────────────────────────────────────────────────────────────────

@app.route('/api/stats', methods=['GET'])
def get_stats():
    uid, err = require_auth()
    if err:
        return err
    now = datetime.now()
    conn = get_db()
    rows = conn.execute(
        '''SELECT SUM(amount) as total, category FROM expenses
           WHERE user_id=? AND strftime('%m',date)=? AND strftime('%Y',date)=?
           GROUP BY category''',
        (uid, f'{now.month:02d}', str(now.year))
    ).fetchall()
    conn.close()
    cats  = {r['category']: r['total'] for r in rows}
    total = sum(cats.values())
    return jsonify({'total_spent': total, 'categories': cats}), 200


# DEBUG ROUTE — remove in production
@app.route('/api/debug/users', methods=['GET'])
def debug_users():
    conn = get_db()
    users = conn.execute('SELECT id, username, fullname, email, created_at FROM users').fetchall()
    conn.close()
    return jsonify([dict(u) for u in users]), 200

# ─── ROOT ─────────────────────────────────────────────────────────────────────

@app.route('/')
def index():
    return jsonify({
        'app': 'NepArtha User-Based Expense Tracker API',
        'version': '2.0',
        'auth_endpoints': {
            'POST /api/auth/register': 'Register new user',
            'POST /api/auth/login':    'Login → returns token',
            'POST /api/auth/logout':   'Invalidate token',
            'GET  /api/auth/me':       'Get current user info'
        },
        'expense_endpoints': {
            'GET    /api/expenses':        'List my expenses',
            'GET    /api/expenses/<id>':   'Get my expense by ID',
            'POST   /api/expenses':        'Add expense',
            'PUT    /api/expenses/<id>':   'Update my expense',
            'DELETE /api/expenses/<id>':   'Delete my expense'
        },
        'budget_endpoints': {
            'GET  /api/budget': 'Get my budget',
            'POST /api/budget': 'Set my budget'
        }
    })

if __name__ == '__main__':
    init_db()
    print("NepArtha v2.0 started — user-scoped expense tracking")
    app.run(debug=True, host='0.0.0.0', port=5000)