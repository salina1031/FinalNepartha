
// dashboard.js — NepArtha v2
// NOTE: API_URL, authFetch, getToken, initPage, logout — all from auth.js
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
    Food: '🍔',
    Transport: '🚗',
    Education: '📚',
    Entertainment: '🎮',
    Shopping: '🛍️',
    Health: '🏥',
    Bills: '📄',
    Others: '📌'
};

// Check if user is logged in



document.addEventListener('DOMContentLoaded', () => {
    const session = initPage(); // from auth.js — redirects if not logged in
    if (!session) return;
    loadDashboard();

    const budgetInput = document.getElementById('budgetInput');
    if (budgetInput) {
        budgetInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') saveBudget();
        });
    }

    window.addEventListener('click', e => {
        const modal = document.getElementById('budgetModal');
        if (e.target === modal) hideBudgetModal();
    });

    document.addEventListener('keydown', e => {
        const modal = document.getElementById('budgetModal');
        if (e.key === 'Escape' && modal && modal.style.display === 'flex') hideBudgetModal();
    });
});

// ─── Load Dashboard ───────────────────────────────────────────────────────────

async function loadDashboard() {
    try {
        const [expRes, budRes] = await Promise.all([
            authFetch(`${API_URL}/expenses`),
            authFetch(`${API_URL}/budget`)
        ]);

        // authFetch returns null if 401 — already redirected to login
        if (!expRes || !budRes) return;

        const expenses = await expRes.json();
        const budData  = await budRes.json();

        // Guard: make sure expenses is an array
        if (!Array.isArray(expenses)) {
            console.error('Unexpected response:', expenses);
            return;
        }

        const monthlyBudget = budData.budget || 0;

        // Update budget button label
        const budgetBtn = document.getElementById('budgetBtn');
        if (budgetBtn) {
            budgetBtn.innerHTML = monthlyBudget === 0 ? '✏️ Set Budget' : '✏️ Edit Budget';
        }

        const currentMonth = getCurrentMonthExpenses(expenses);
        const totalSpent   = currentMonth.reduce((s, e) => s + e.amount, 0);
        const remaining    = monthlyBudget - totalSpent;

        document.getElementById('totalSpent').textContent    = `NPR ${totalSpent.toFixed(2)}`;
        document.getElementById('monthlyBudget').textContent = `NPR ${monthlyBudget.toFixed(2)}`;
        document.getElementById('remaining').textContent     = `NPR ${remaining.toFixed(2)}`;

        const remCard = document.getElementById('remainingCard');
        if (remaining < 0) {
            remCard.className = 'cards card-red';
            document.getElementById('budgetWarning').style.display = 'block';
        } else {
            remCard.className = 'cards card-green';
            document.getElementById('budgetWarning').style.display = 'none';
        }

        loadCategoryChart(currentMonth);
        loadTrendChart(expenses);
        loadRecentTransactions(currentMonth);

    } catch (err) {
        console.error('Dashboard error:', err);
    }
}

function getCurrentMonthExpenses(expenses) {
    const now = new Date();
    return expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
}

// ─── Charts ───────────────────────────────────────────────────────────────────

function loadCategoryChart(expenses) {
    const totals = {};
    expenses.forEach(e => { totals[e.category] = (totals[e.category] || 0) + e.amount; });

    const labels = Object.keys(totals);
    if (!labels.length) return;

    const ctx = document.getElementById('categoryChart').getContext('2d');
    if (window.categoryChartInstance) window.categoryChartInstance.destroy();

    window.categoryChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                data: Object.values(totals),
                backgroundColor: labels.map(l => categoryColors[l]),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: c => `${c.label}: NPR ${c.parsed.toFixed(2)}`
                    }
                }
            }
        }
    });
}

function loadTrendChart(expenses) {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        const total = expenses
            .filter(e => {
                const ed = new Date(e.date);
                return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
            })
            .reduce((s, e) => s + e.amount, 0);
        return {
            month: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            amount: total
        };
    });

    const ctx = document.getElementById('trendChart').getContext('2d');
    if (window.trendChartInstance) window.trendChartInstance.destroy();

    window.trendChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months.map(m => m.month),
            datasets: [{
                label: 'Monthly Expenses',
                data: months.map(m => m.amount),
                backgroundColor: '#667eea'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: v => 'NPR ' + v }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: c => 'NPR ' + c.parsed.y.toFixed(2) } }
            }
        }
    });
}

function loadRecentTransactions(expenses) {
    const container = document.getElementById('recentTransactions');
    if (!expenses.length) {
        container.innerHTML = '<p class="no-data">No expenses recorded yet.</p>';
        return;
    }

    const recent = [...expenses]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    container.innerHTML = recent.map(e => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-icon">${categoryIcons[e.category] || '📌'}</div>
                <div class="transaction-details">
                    <h4>${e.description || e.category}</h4>
                    <p>${new Date(e.date).toLocaleDateString()}</p>
                </div>
            </div>
            <div class="transaction-amount">NPR ${e.amount.toFixed(2)}</div>
        </div>
    `).join('');
}

// ─── Budget Modal ─────────────────────────────────────────────────────────────

function showBudgetModal() {
    const current = parseFloat(
        document.getElementById('monthlyBudget').textContent.replace('NPR ', '')
    );
    if (current > 0) document.getElementById('budgetInput').value = current;
    document.getElementById('budgetModal').style.display = 'flex';
    setTimeout(() => document.getElementById('budgetInput').focus(), 100);
}

function hideBudgetModal() {
    document.getElementById('budgetModal').style.display = 'none';
    document.getElementById('budgetInput').value = '';
}

async function saveBudget() {
    const budget = parseFloat(document.getElementById('budgetInput').value);
    if (!budget || budget <= 0) {
        alert('Please enter a valid budget amount');
        return;
    }
    try {
        const res = await authFetch(`${API_URL}/budget`, {
            method: 'POST',
            body: JSON.stringify({ budget })
        });
        if (res && res.ok) {
            hideBudgetModal();
            loadDashboard();
            showNotification('Budget updated successfully!', 'success');
        } else {
            showNotification('Failed to update budget', 'error');
        }
    } catch {
        showNotification('Failed to update budget', 'error');
    }
}

function showNotification(msg, type) {
    const n = document.createElement('div');
    n.textContent = msg;
    n.style.cssText = `
        position:fixed; top:20px; right:20px;
        padding:14px 22px;
        background:${type === 'success' ? '#27ae60' : '#e74c3c'};
        color:white; border-radius:8px;
        box-shadow:0 4px 12px rgba(0,0,0,.25);
        z-index:10000; font-weight:600;
    `;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}