// NOTE: API_URL, authFetch, getSession, initPage, logout — all from auth.js
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
let currentBudget = 0;
let allExpenses   = [];

// ─── Bootstrap ───────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    const session = initPage(); // from auth.js
    if (!session) return;

    loadReports();

    document.getElementById('saveBudget').addEventListener('click',  saveBudget);
    document.getElementById('exportCSV').addEventListener('click',   exportCSV);
    document.getElementById('printReport').addEventListener('click', () => window.print());
});

// ─── Load ─────────────────────────────────────────────────────────────────────

async function loadReports() {
    try {
        const [expRes, budRes] = await Promise.all([
            authFetch(`${API_URL}/expenses`),
            authFetch(`${API_URL}/budget`)
        ]);
        if (!expRes || !budRes) return;

        const expData = await expRes.json();
        const budData = await budRes.json();

        // Guard: must be array
        allExpenses   = Array.isArray(expData) ? expData : [];
        currentBudget = budData.budget || 0;

        document.getElementById('budgetInput').value = currentBudget;
        updateBudgetOverview();
        updateCategoryBreakdown();
        loadCategoryPieChart();
        loadMonthlyBarChart();

    } catch (err) {
        console.error('Report error:', err);
    }
}

// ─── Budget ───────────────────────────────────────────────────────────────────

async function saveBudget() {
    const val = parseFloat(document.getElementById('budgetInput').value);
    const msg = document.getElementById('budgetMsg');

    if (!val || val <= 0) {
        msg.textContent = 'Please enter a valid budget amount';
        msg.style.color = '#e74c3c';
        return;
    }

    try {
        const res = await authFetch(`${API_URL}/budget`, {
            method: 'POST',
            body:   JSON.stringify({ budget: val })
        });

        if (res && res.ok) {
            currentBudget   = val;
            msg.textContent = 'Budget saved successfully!';
            msg.style.color = '#27ae60';
            updateBudgetOverview();
        } else {
            msg.textContent = 'Failed to save budget';
            msg.style.color = '#e74c3c';
        }
    } catch {
        msg.textContent = 'Error connecting to server';
        msg.style.color = '#e74c3c';
    }
}

function getThisMonthExpenses() {
    const now = new Date();
    return allExpenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
}

function updateBudgetOverview() {
    const monthExp  = getThisMonthExpenses();
    const spent     = monthExp.reduce((s, e) => s + e.amount, 0);
    const remaining = currentBudget - spent;
    const pct       = currentBudget ? (spent / currentBudget) * 100 : 0;

    document.getElementById('budgetAmount').textContent    = `NPR ${currentBudget.toFixed(2)}`;
    document.getElementById('spentAmount').textContent     = `NPR ${spent.toFixed(2)}`;
    document.getElementById('remainingAmount').textContent = `NPR ${remaining.toFixed(2)}`;
    document.getElementById('remainingAmount').style.color = remaining >= 0 ? '#27ae60' : '#e74c3c';

    const bar       = document.getElementById('progressFill');
    bar.style.width = `${Math.min(pct, 100)}%`;
    bar.className   = 'progress-fill' + (pct > 100 ? ' over-budget' : '');
}

function updateCategoryBreakdown() {
    const monthExp = getThisMonthExpenses();
    const totals   = {};
    monthExp.forEach(e => { totals[e.category] = (totals[e.category] || 0) + e.amount; });

    const total     = Object.values(totals).reduce((s, v) => s + v, 0);
    const container = document.getElementById('categoryBreakdown');

    if (!Object.keys(totals).length) {
        container.innerHTML = '<p class="no-data">No data available</p>';
        return;
    }

    container.innerHTML = Object.entries(totals).map(([cat, amt]) => `
        <div class="category-item">
            <div class="category-name">${cat}</div>
            <div class="category-bar">
                <div class="category-bar-fill"
                     style="width:${(amt/total*100).toFixed(1)}%;
                            background:${categoryColors[cat]}"></div>
            </div>
            <div class="category-amount">NPR ${amt.toFixed(2)}</div>
        </div>
    `).join('');
}

// ─── Charts ───────────────────────────────────────────────────────────────────

function loadCategoryPieChart() {
    const monthExp = getThisMonthExpenses();
    const totals   = {};
    monthExp.forEach(e => { totals[e.category] = (totals[e.category] || 0) + e.amount; });

    const labels = Object.keys(totals);
    if (!labels.length) return;

    const ctx = document.getElementById('categoryPieChart').getContext('2d');
    if (window.catChart) window.catChart.destroy();

    window.catChart = new Chart(ctx, {
        type: 'doughnut',
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
                        label: c => {
                            const total = c.dataset.data.reduce((a, b) => a + b, 0);
                            return `${c.label}: NPR ${c.parsed.toFixed(2)} (${(c.parsed/total*100).toFixed(1)}%)`;
                        }
                    }
                }
            }
        }
    });
}

function loadMonthlyBarChart() {
    const now    = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
        const d     = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        const total = allExpenses
            .filter(e => {
                const ed = new Date(e.date);
                return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
            })
            .reduce((s, e) => s + e.amount, 0);
        return { month: d.toLocaleDateString('en-US', { month: 'short' }), amount: total };
    });

    const ctx = document.getElementById('monthlyBarChart').getContext('2d');
    if (window.barChart) window.barChart.destroy();

    window.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months.map(m => m.month),
            datasets: [{
                label: 'Expenses',
                data:  months.map(m => m.amount),
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

// ─── Export ───────────────────────────────────────────────────────────────────

function exportCSV() {
    if (!allExpenses.length) { alert('No data to export'); return; }

    const session   = getSession(); // from auth.js
    const userLabel = session ? `# User: ${session.fullname || session.username}\n` : '';
    let csv         = userLabel + 'Date,Category,Description,Amount\n';

    allExpenses.forEach(e => {
        csv += `${e.date},${e.category},"${e.description || ''}",${e.amount}\n`;
    });

    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `nepartha_${(session?.username || 'user')}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
}