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

// Category Icons
const categoryIcons = {
    'Food': '🍔',
    'Transport': '🚗',
    'Education': '📚',
    'Entertainment': '🎮',
    'Shopping': '🛍️',
    'Health': '🏥',
    'Bills': '📄',
    'Others': '📌'
};

// Check if user is logged in
function checkAuth() {
    const session = localStorage.getItem('nepartha_session') || sessionStorage.getItem('nepartha_session');
    
    if (!session) {
        window.location.href = 'login.html';
        return;
    }
    
    const user = JSON.parse(session);
    document.getElementById('userName').textContent = user.fullname;
}

// Logout function
function logout() {
    localStorage.removeItem('nepartha_session');
    sessionStorage.removeItem('nepartha_session');
    window.location.href = 'login.html';
}

// Show Budget Modal
function showBudgetModal() {
    const modal = document.getElementById('budgetModal');
    const currentBudget = document.getElementById('monthlyBudget').textContent.replace('NPR ', '').trim();
    const budgetValue = parseFloat(currentBudget);
    
    // Pre-fill with current budget if it exists and is not 0
    if (budgetValue && budgetValue > 0) {
        document.getElementById('budgetInput').value = budgetValue;
    } else {
        document.getElementById('budgetInput').value = '';
    }
    
    modal.style.display = 'flex';
    
    // Focus on input field
    setTimeout(() => {
        document.getElementById('budgetInput').focus();
    }, 100);
}

// Hide Budget Modal
function hideBudgetModal() {
    const modal = document.getElementById('budgetModal');
    modal.style.display = 'none';
    // Clear input on close
    document.getElementById('budgetInput').value = '';
}

// Save Budget
async function saveBudget() {
    const budgetInput = document.getElementById('budgetInput');
    const budget = parseFloat(budgetInput.value);

    if (!budget || budget <= 0) {
        alert('Please enter a valid budget amount');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/budget`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ budget: budget })
        });

        if (response.ok) {
            hideBudgetModal();
            loadDashboard();
            showNotification('Budget updated successfully!', 'success');
        } else {
            throw new Error('Failed to update budget');
        }
    } catch (error) {
        console.error('Error saving budget:', error);
        showNotification('Failed to update budget', 'error');
    }
}

// Show Notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Load Dashboard Data
async function loadDashboard() {
    try {
        // Fetch expenses
        const expensesResponse = await fetch(`${API_URL}/expenses`);
        const expenses = await expensesResponse.json();

        // Fetch budget
        const budgetResponse = await fetch(`${API_URL}/budget`);
        const budgetData = await budgetResponse.json();
        const monthlyBudget = budgetData.budget || 0;

        // Update budget button text based on whether budget is set
        const budgetBtn = document.getElementById('budgetBtn');
        if (monthlyBudget === 0) {
            budgetBtn.innerHTML = '✏️ Set Budget';
        } else {
            budgetBtn.innerHTML = '✏️ Edit Budget';
        }

        // Calculate current month expenses
        const currentMonthExpenses = getCurrentMonthExpenses(expenses);
        const totalSpent = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const remaining = monthlyBudget - totalSpent;

        // Update summary cards
        document.getElementById('totalSpent').textContent = `NPR ${totalSpent.toFixed(2)}`;
        document.getElementById('monthlyBudget').textContent = `NPR ${monthlyBudget.toFixed(2)}`;
        document.getElementById('remaining').textContent = `NPR ${remaining.toFixed(2)}`;

        // Update remaining card color
        const remainingCard = document.getElementById('remainingCard');
        if (remaining < 0) {
            remainingCard.className = 'cards card-red';
            document.getElementById('budgetWarning').style.display = 'block';
        } else {
            remainingCard.className = 'cards card-green';
            document.getElementById('budgetWarning').style.display = 'none';
        }

        // Load charts
        loadCategoryChart(currentMonthExpenses);
        loadTrendChart(expenses);

        // Load recent transactions
        loadRecentTransactions(currentMonthExpenses);

    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Get current month expenses
function getCurrentMonthExpenses(expenses) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });
}

// Load Category Pie Chart
function loadCategoryChart(expenses) {
    const categoryTotals = {};
    expenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    const colors = labels.map(cat => categoryColors[cat]);

    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.categoryChartInstance) {
        window.categoryChartInstance.destroy();
    }

    window.categoryChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: NPR ${value.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}

// Load Monthly Trend Chart
function loadTrendChart(expenses) {
    const last6Months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthExpenses = expenses.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getMonth() === date.getMonth() && 
                   expDate.getFullYear() === date.getFullYear();
        });

        const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        last6Months.push({
            month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            amount: total
        });
    }

    const ctx = document.getElementById('trendChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.trendChartInstance) {
        window.trendChartInstance.destroy();
    }

    window.trendChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: last6Months.map(m => m.month),
            datasets: [{
                label: 'Monthly Expenses',
                data: last6Months.map(m => m.amount),
                backgroundColor: '#667eea',
                borderColor: '#667eea',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'NPR ' + value;
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'NPR ' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            }
        }
    });
}

// Load Recent Transactions
function loadRecentTransactions(expenses) {
    const container = document.getElementById('recentTransactions');
    
    if (expenses.length === 0) {
        container.innerHTML = '<p class="no-data">No expenses recorded yet.</p>';
        return;
    }

    // Sort by date (most recent first) and take last 5
    const recent = expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    container.innerHTML = recent.map(exp => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-icon">${categoryIcons[exp.category]}</div>
                <div class="transaction-details">
                    <h4>${exp.description || exp.category}</h4>
                    <p>${new Date(exp.date).toLocaleDateString()}</p>
                </div>
            </div>
            <div class="transaction-amount">NPR ${exp.amount.toFixed(2)}</div>
        </div>
    `).join('');
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

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('budgetModal');
    if (event.target === modal) {
        hideBudgetModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('budgetModal');
        if (modal.style.display === 'flex') {
            hideBudgetModal();
        }
    }
});

// Handle Enter key in budget input
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadDashboard();
    
    // Add Enter key listener to budget input
    const budgetInput = document.getElementById('budgetInput');
    if (budgetInput) {
        budgetInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                saveBudget();
            }
        });
    }
});