// expenses.js — NepArtha v2
// NOTE: API_URL, authFetch, initPage, logout — all from auth.js

const categoryColors = {
    Food: '#FF6384',
    Transport: '#36A2EB', 
    Education: '#FFCE56',
    Entertainment: '#4BC0C0', 
    Shopping: '#9966FF', 
    Health: '#FF9F40',
    Bills: '#E74C3C', 
    Others: '#95A5A6'
};

let allExpenses = [];
let deleteExpenseId = null;

// ─── Bootstrap ───────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
    const session = initPage(); // from auth.js
    if (!session) return;

    loadExpenses();

    document.getElementById('filterCategory').addEventListener('change', filterAndDisplay);
    document.getElementById('filterMonth').addEventListener('change', filterAndDisplay);
    document.getElementById('confirmDeleteBtn').addEventListener('click', deleteExpense);
    document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);
});

// ─── Load ─────────────────────────────────────────────────────────────────────

async function loadExpenses() {
    try {
        const res = await authFetch(`${API_URL}/expenses`);
        if (!res) return;

        const data = await res.json();

        // Guard: must be array
        if (!Array.isArray(data)) {
            console.error('Expected array, got:', data);
            document.getElementById('expensesTableBody').innerHTML =
                '<tr><td colspan="5" class="no-data">Error loading expenses</td></tr>';
            return;
        }

        allExpenses = data;
        populateMonthFilter();
        filterAndDisplay();

    } catch (err) {
        console.error('Error loading expenses:', err);
        document.getElementById('expensesTableBody').innerHTML =
            '<tr><td colspan="5" class="no-data">Error loading expenses</td></tr>';
    }
}

// ─── Filter ───────────────────────────────────────────────────────────────────

function populateMonthFilter() {
    const select = document.getElementById('filterMonth');
    while (select.options.length > 1) select.remove(1);

    const months = new Set(allExpenses.map(e => {
        const d = new Date(e.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }));

    [...months].sort().reverse().forEach(my => {
        const [yr, mo] = my.split('-');
        const label = new Date(yr, mo - 1)
            .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const opt = document.createElement('option');
        opt.value = my;
        opt.textContent = label;
        select.appendChild(opt);
    });
}

function filterAndDisplay() {
    const cat = document.getElementById('filterCategory').value;
    const month = document.getElementById('filterMonth').value;

    let list = allExpenses;
    if (cat !== 'all') {
        list = list.filter(e => e.category === cat);
    }
    if (month !== 'all') {
        list = list.filter(e => {
            const d = new Date(e.date);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === month;
        });
    }
    displayExpenses(list);
}

// ─── Display ──────────────────────────────────────────────────────────────────

function displayExpenses(expenses) {
    const tbody = document.getElementById('expensesTableBody');
    const total = document.getElementById('totalAmount');

    if (!expenses.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data">No expenses found</td></tr>';
        total.textContent = 'NPR 0.00';
        return;
    }

    const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    total.textContent = `NPR ${sorted.reduce((s, e) => s + e.amount, 0).toFixed(2)}`;

    tbody.innerHTML = sorted.map(exp => `
        <tr>
            <td>${new Date(exp.date).toLocaleDateString()}</td>
            <td>
                <span class="category-badge"
                      style="background:${categoryColors[exp.category]}22;
                             color:${categoryColors[exp.category]}">
                    ${exp.category}
                </span>
            </td>
            <td>${exp.description || '—'}</td>
            <td style="font-weight:700;color:#e74c3c">NPR ${exp.amount.toFixed(2)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit"   onclick="editExpense(${exp.id})">✏️ Edit</button>
                    <button class="btn-delete" onclick="showDeleteModal(${exp.id})">🗑️ Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

function editExpense(id) {
    window.location.href = `addExpenses.html?edit=${id}`;
}

function showDeleteModal(id) {
    deleteExpenseId = id;
    document.getElementById('deleteModal').style.display = 'flex';
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    deleteExpenseId = null;
}

async function deleteExpense() {
    try {
        const res = await authFetch(`${API_URL}/expenses/${deleteExpenseId}`, {
            method: 'DELETE'
        });
        if (res && res.ok) {
            closeDeleteModal();
            loadExpenses();
        } else {
            alert('Failed to delete expense');
        }
    } catch {
        alert('Error connecting to server');
    }
}