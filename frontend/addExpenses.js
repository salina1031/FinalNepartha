// API Base URL
const API_URL = 'http://localhost:5000/api';

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
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('edit')) {
    editingId = urlParams.get('edit');
    loadExpenseForEdit(editingId);
}

// Load expense data for editing
async function loadExpenseForEdit(id) {
    try {
        const response = await fetch(`${API_URL}/expenses/${id}`);
        const expense = await response.json();

        amountInput.value = expense.amount;
        categorySelect.value = expense.category;
        descriptionInput.value = expense.description || '';
        dateInput.value = expense.date;

        formTitle.textContent = 'Edit Expense';
        submitBtn.innerHTML = ' Update Expense';
        cancelBtn.style.display = 'inline-block';

    } catch (error) {
        showError('Error loading expense data');
        console.error('Error:', error);
    }
}

// Submit form
submitBtn.addEventListener('click', async function() {
    // Clear messages
    hideMessages();

    // Validate form
    if (!amountInput.value || !categorySelect.value || !dateInput.value) {
        showError('Please fill in all required fields');
        return;
    }

    const amount = parseFloat(amountInput.value);
    if (amount <= 0) {
        showError('Amount must be greater than 0');
        return;
    }

    // Prepare data
    const expenseData = {
        amount: amount,
        category: categorySelect.value,
        description: descriptionInput.value,
        date: dateInput.value
    };

    try {
        let response;
        if (editingId) {
            // Update existing expense
            response = await fetch(`${API_URL}/expenses/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(expenseData)
            });
        } else {
            // Add new expense
            response = await fetch(`${API_URL}/expenses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(expenseData)
            });
        }

        if (response.ok) {
            showSuccess(editingId ? 'Expense updated successfully!' : 'Expense added successfully!');
            
            // Reset form after 1 second
            setTimeout(() => {
                if (editingId) {
                    window.location.href = 'expenses.html';
                } else {
                    resetForm();
                }
            }, 1000);
        } else {
            showError('Failed to save expense');
        }

    } catch (error) {
        showError('Error connecting to server');
        console.error('Error:', error);
    }
});

// Cancel editing
cancelBtn.addEventListener('click', function() {
    window.location.href = 'expenses.html';
});

// Reset form
function resetForm() {
    amountInput.value = '';
    categorySelect.value = 'Food';
    descriptionInput.value = '';
    dateInput.value = new Date().toISOString().split('T')[0];
    hideMessages();
}

// Show success message
function showSuccess(message) {
    successMsg.textContent = message;
    successMsg.style.display = 'block';
    errorMsg.style.display = 'none';
}

// Show error message
function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    successMsg.style.display = 'none';
}

// Hide messages
function hideMessages() {
    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';
}

// Language Toggle (placeholder)
document.getElementById('langToggle').addEventListener('click', function() {
    const currentLang = this.textContent;
    if (currentLang === 'नेपाली') {
        this.textContent = 'English';
        // Implement Nepali translations here
    } else {
        this.textContent = 'नेपाली';
        // Implement English translations here
    }
});