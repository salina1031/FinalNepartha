// API Base URL
const API_URL = 'http://localhost:5000/api';

// Category Colors
const categoryColors = {
    'Food': '#FF6384',
    'Transport': '#36A2EB',
    'Education': '#FFCE56',
    'Entertainment': '#4BC0C0',
    'Shopping': '#9966FF',
    'Health': '#FF9F40',
    'Bills': '#E74C3C',
    'Others': '#95A5A6'
};

let allExpenses = [];
let deleteExpenseId = null;

// Load expenses
async function loadExpenses() {
    try {
        const response = await fetch(`${API_URL}/expenses`);
        allExpenses = await response.json();

        populateMonthFilter();
        filterAndDisplayExpenses();

    } catch (error) {
        console.error('Error loading expenses:', error);
        document.getElementById('expensesTableBody').innerHTML =
            '<tr><td colspan="5" class="no-data">Error loading expenses</td></tr>';
    }
}

// Populate month filter dropdown
function populateMonthFilter() {
    const monthFilter = document.getElementById('filterMonth');
    const months = new Set();

    allExpenses.forEach(exp => {
        const date = new Date(exp.date);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        months.add(monthYear);
    });

    const sortedMonths = Array.from(months).sort().reverse();

    sortedMonths.forEach(monthYear => {
        const [year, month] = monthYear.split('-');
        const date = new Date(year, month - 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        const option = document.createElement('option');
        option.value = monthYear;
        option.textContent = monthName;
        monthFilter.appendChild(option);
    });
}

// Filter and display expenses
function filterAndDisplayExpenses() {
    const categoryFilter = document.getElementById('filterCategory').value;
    const monthFilter = document.getElementById('filterMonth').value;

    let filteredExpenses = allExpenses;

    // Filter by category
    if (categoryFilter !== 'all') {
        filteredExpenses = filteredExpenses.filter(exp => exp.category === categoryFilter);
    }

    // Filter by month
    if (monthFilter !== 'all') {
        filteredExpenses = filteredExpenses.filter(exp => {
            const expDate = new Date(exp.date);
            const expMonthYear = `${expDate.getFullYear()}-${String(expDate.getMonth() + 1).padStart(2, '0')}`;
            return expMonthYear === monthFilter;
        });
    }

    displayExpenses(filteredExpenses);
}

// Display expenses in table
function displayExpenses(expenses) {
    const tbody = document.getElementById('expensesTableBody');
    const totalAmount = document.getElementById('totalAmount');

    if (expenses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data">No expenses found</td></tr>';
        totalAmount.textContent = 'NPR 0.00';
        return;
    }

    // Sort by date (most recent first)
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate total
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    totalAmount.textContent = `NPR ${total.toFixed(2)}`;

    // Display expenses
    tbody.innerHTML = expenses.map(exp => `
        <tr>
            <td>${new Date(exp.date).toLocaleDateString()}</td>
            <td>
                <span class="category-badge" style="background-color: ${categoryColors[exp.category]}20; color: ${categoryColors[exp.category]}">
                    ${exp.category}
                </span>
            </td>
            <td>${exp.description || '-'}</td>
            <td style="font-weight: bold; color: #e74c3c;">NPR ${exp.amount.toFixed(2)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editExpense(${exp.id})">✏️ Edit</button>
                    <button class="btn-delete" onclick="showDeleteModal(${exp.id})">🗑️ Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Edit expense
function editExpense(id) {
    window.location.href = `addExpenses.html?edit=${id}`;
}

// Show delete confirmation modal
function showDeleteModal(id) {
    deleteExpenseId = id;
    document.getElementById('deleteModal').style.display = 'flex';
}

// Delete expense
async function deleteExpense() {
    try {
        const response = await fetch(`${API_URL}/expenses/${deleteExpenseId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            closeDeleteModal();
            loadExpenses();
        } else {
            alert('Failed to delete expense');
        }

    } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Error connecting to server');
    }
}

// Close delete modal
function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    deleteExpenseId = null;
}

// Language Toggle (placeholder)
function setupLangToggle() {
    document.getElementById('langToggle').addEventListener('click', function () {
        const currentLang = this.textContent;
        if (currentLang === 'नेपाली') {
            this.textContent = 'English';
        } else {
            this.textContent = 'नेपाली';
        }
    });
}

// All event listeners inside DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    loadExpenses();

    document.getElementById('filterCategory').addEventListener('change', filterAndDisplayExpenses);
    document.getElementById('filterMonth').addEventListener('change', filterAndDisplayExpenses);

    // FIX: "confirmDeleteBtn" — HTML ma pani same id rakhnuhos (tala hernus)
    document.getElementById('confirmDeleteBtn').addEventListener('click', deleteExpense);
    document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);

    setupLangToggle();
});