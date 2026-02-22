

// Get form elements
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const descriptionInput = document.getElementById('description');
const dateInput = document.getElementById('date');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const successMsg = document.getElementById('successMsg');
const errorMsg = document.getElementById('errorMsg');
const formTitle = document.getElementById('formTitle');

// Set default date to today
dateInput.value = new Date().toISOString().split('T')[0];

// Check if editing expense
let editingId = null;
document.addEventListener('DOMContentLoaded', () => {
    const session = initPage();   // auth.js — redirects if not logged in
    if (!session) return;

    const params = new URLSearchParams(window.location.search);
    if (params.has('edit')) {
        editingId = params.get('edit');
        loadExpenseForEdit(editingId);
    }
});
// Load expense data for editing
async function loadExpenseForEdit(id) {
    try {
        const res = await authFetch(`${API_URL}/expenses/${id}`);
        if (!res) return;
        if (!res.ok) { showError('Expense not found or access denied'); return; }

        const exp = await res.json();
        amountInput.value      = exp.amount;
        categorySelect.value   = exp.category;
        descriptionInput.value = exp.description || '';
        dateInput.value        = exp.date;

        formTitle.textContent   = 'Edit Expense';
        submitBtn.innerHTML     = '✏️ Update Expense';
        cancelBtn.style.display = 'inline-block';

    } catch (err) {
        showError('Error loading expense data');
        console.error(err);
    }
}

// ─── Submit ───────────────────────────────────────────────────────────────────

submitBtn.addEventListener('click', async function () {
    hideMessages();

    if (!amountInput.value || !categorySelect.value || !dateInput.value) {
        showError('Please fill in all required fields');
        return;
    }

    const amount = parseFloat(amountInput.value);
    if (amount <= 0) {
        showError('Amount must be greater than 0');
        return;
    }

    const payload = {
        amount,
        category:    categorySelect.value,
        description: descriptionInput.value,
        date:        dateInput.value
    };

    try {
        const res = editingId
            ? await authFetch(`${API_URL}/expenses/${editingId}`, {
                method: 'PUT',
                body:   JSON.stringify(payload)
              })
            : await authFetch(`${API_URL}/expenses`, {
                method: 'POST',
                body:   JSON.stringify(payload)
              });

        if (!res) return; // auth redirect happened

        if (res.ok) {
            showSuccess(editingId ? 'Expense updated successfully!' : 'Expense added successfully!');
            setTimeout(() => {
                if (editingId) {
                    window.location.href = 'expenses.html';
                } else {
                    resetForm();
                }
            }, 1000);
        } else {
            const data = await res.json();
            showError(data.error || 'Failed to save expense');
        }

    } catch (err) {
        showError('Error connecting to server');
        console.error(err);
    }
});

cancelBtn.addEventListener('click', () => {
    window.location.href = 'expenses.html';
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resetForm() {
    amountInput.value      = '';
    categorySelect.value   = 'Food';
    descriptionInput.value = '';
    dateInput.value        = new Date().toISOString().split('T')[0];
    hideMessages();
}

function showSuccess(msg) {
    successMsg.textContent   = msg;
    successMsg.style.display = 'block';
    errorMsg.style.display   = 'none';
}

function showError(msg) {
    errorMsg.textContent   = msg;
    errorMsg.style.display = 'block';
    successMsg.style.display = 'none';
}

function hideMessages() {
    successMsg.style.display = 'none';
    errorMsg.style.display   = 'none';
}
