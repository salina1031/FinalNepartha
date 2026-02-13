from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database configuration
DATABASE = 'nepartha.db'

# Initialize database
def init_db():
    """Initialize the database with required tables"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Create expenses table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            description TEXT,
            date TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create budget table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS budget (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            budget REAL NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Insert default budget if not exists
    cursor.execute('SELECT COUNT(*) FROM budget')
    if cursor.fetchone()[0] == 0:
        cursor.execute('INSERT INTO budget (budget) VALUES (15000)')
    
    conn.commit()
    conn.close()

# Database helper function
def get_db():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# API Routes

@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    """Get all expenses"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM expenses ORDER BY date DESC')
        expenses = cursor.fetchall()
        conn.close()
        
        # Convert to list of dictionaries
        expenses_list = []
        for exp in expenses:
            expenses_list.append({
                'id': exp['id'],
                'amount': exp['amount'],
                'category': exp['category'],
                'description': exp['description'],
                'date': exp['date']
            })
        
        return jsonify(expenses_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/expenses/<int:expense_id>', methods=['GET'])
def get_expense(expense_id):
    """Get a single expense by ID"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM expenses WHERE id = ?', (expense_id,))
        expense = cursor.fetchone()
        conn.close()
        
        if expense is None:
            return jsonify({'error': 'Expense not found'}), 404
        
        return jsonify({
            'id': expense['id'],
            'amount': expense['amount'],
            'category': expense['category'],
            'description': expense['description'],
            'date': expense['date']
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    """Add a new expense"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('amount') or not data.get('category') or not data.get('date'):
            return jsonify({'error': 'Missing required fields'}), 400
        
        amount = float(data['amount'])
        category = data['category']
        description = data.get('description', '')
        date = data['date']
        
        # Validate amount
        if amount <= 0:
            return jsonify({'error': 'Amount must be greater than 0'}), 400
        
        # Insert into database
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO expenses (amount, category, description, date)
            VALUES (?, ?, ?, ?)
        ''', (amount, category, description, date))
        conn.commit()
        expense_id = cursor.lastrowid
        conn.close()
        
        return jsonify({
            'id': expense_id,
            'message': 'Expense added successfully'
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/expenses/<int:expense_id>', methods=['PUT'])
def update_expense(expense_id):
    """Update an existing expense"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('amount') or not data.get('category') or not data.get('date'):
            return jsonify({'error': 'Missing required fields'}), 400
        
        amount = float(data['amount'])
        category = data['category']
        description = data.get('description', '')
        date = data['date']
        
        # Validate amount
        if amount <= 0:
            return jsonify({'error': 'Amount must be greater than 0'}), 400
        
        # Update in database
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE expenses
            SET amount = ?, category = ?, description = ?, date = ?
            WHERE id = ?
        ''', (amount, category, description, date, expense_id))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Expense not found'}), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Expense updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    """Delete an expense"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM expenses WHERE id = ?', (expense_id,))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Expense not found'}), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Expense deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/budget', methods=['GET'])
def get_budget():
    """Get current budget"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT budget FROM budget ORDER BY id DESC LIMIT 1')
        result = cursor.fetchone()
        conn.close()
        
        if result is None:
            return jsonify({'budget': 15000}), 200
        
        return jsonify({'budget': result['budget']}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/budget', methods=['POST'])
def set_budget():
    """Set or update budget"""
    try:
        data = request.get_json()
        
        if not data.get('budget'):
            return jsonify({'error': 'Budget amount is required'}), 400
        
        budget = float(data['budget'])
        
        if budget <= 0:
            return jsonify({'error': 'Budget must be greater than 0'}), 400
        
        conn = get_db()
        cursor = conn.cursor()
        
        # Update or insert budget
        cursor.execute('DELETE FROM budget')
        cursor.execute('INSERT INTO budget (budget) VALUES (?)', (budget,))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Budget updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get statistics for current month"""
    try:
        # Get current month and year
        now = datetime.now()
        current_month = now.month
        current_year = now.year
        
        conn = get_db()
        cursor = conn.cursor()
        
        # Get monthly expenses
        cursor.execute('''
            SELECT SUM(amount) as total, category
            FROM expenses
            WHERE strftime('%m', date) = ? AND strftime('%Y', date) = ?
            GROUP BY category
        ''', (f'{current_month:02d}', str(current_year)))
        
        categories = cursor.fetchall()
        conn.close()
        
        category_totals = {}
        total_spent = 0
        
        for cat in categories:
            category_totals[cat['category']] = cat['total']
            total_spent += cat['total']
        
        return jsonify({
            'total_spent': total_spent,
            'categories': category_totals
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Home route
@app.route('/')
def index():
    return jsonify({
        'message': 'NepArtha Expense Management API',
        'version': '1.0',
        'endpoints': {
            'GET /api/expenses': 'Get all expenses',
            'GET /api/expenses/<id>': 'Get expense by ID',
            'POST /api/expenses': 'Add new expense',
            'PUT /api/expenses/<id>': 'Update expense',
            'DELETE /api/expenses/<id>': 'Delete expense',
            'GET /api/budget': 'Get budget',
            'POST /api/budget': 'Set budget',
            'GET /api/stats': 'Get monthly statistics'
        }
    })

if __name__ == '__main__':
    # Initialize database
    init_db()
    print("Database initialized successfully!")
    print("Starting NepArtha server...")
    
    # Run the application
    app.run(debug=True, host='0.0.0.0', port=5000)