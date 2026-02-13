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

let currentBudget = 15000;
let allExpenses = [];

// Load reports data
async function loadReports() {
    try {
        // Fetch expenses
        const expensesResponse = await fetch(`${API_URL}/expenses`);
        allExpenses = await expensesResponse.json();

        // Fetch budget
        const budgetResponse = await fetch(`${API_URL}/budget`);
        const budgetData = await budgetResponse.json();
        currentBudget = budgetData.budget || 15000;

        // Update UI
        document.getElementById('budgetInput').value = currentBudget;
        updateBudgetOverview();
        updateCategoryBreakdown();
        loadCategoryPieChart();
        loadMonthlyBarChart();

    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

// Save budget
document.getElementById('saveBudget').addEventListener('click', async function() {
    const budgetInput = document.getElementById('budgetInput');
    const newBudget = parseFloat(budgetInput.value);

    if (isNaN(newBudget) || newBudget <= 0) {
        document.getElementById('budgetMsg').textContent = 'Please enter a valid budget amount';
        document.getElementById('budgetMsg').style.color = '#e74c3c';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/budget`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ budget: newBudget })
        });

        if (response.ok) {
            currentBudget = newBudget;
            document.getElementById('budgetMsg').textContent = 'Budget saved successfully!';
            document.getElementById('budgetMsg').style.color = '#27ae60';
            updateBudgetOverview();
        } else {
            document.getElementById('budgetMsg').textContent = 'Failed to save budget';
            document.getElementById('budgetMsg').style.color = '#e74c3c';
        }

    } catch (error) {
        console.error('Error saving budget:', error);
        document.getElementById('budgetMsg').textContent = 'Error connecting to server';
        document.getElementById('budgetMsg').style.color = '#e74c3c';
    }
});

// Update budget overview
function updateBudgetOverview() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthExpenses = allExpenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });

    const totalSpent = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const remaining = currentBudget - totalSpent;
    const percentage = (totalSpent / currentBudget) * 100;

    document.getElementById('budgetAmount').textContent = `NPR ${currentBudget.toFixed(2)}`;
    document.getElementById('spentAmount').textContent = `NPR ${totalSpent.toFixed(2)}`;
    document.getElementById('remainingAmount').textContent = `NPR ${remaining.toFixed(2)}`;
    document.getElementById('remainingAmount').style.color = remaining >= 0 ? '#27ae60' : '#e74c3c';

    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = `${Math.min(percentage, 100)}%`;
    
    if (percentage > 100) {
        progressFill.classList.add('over-budget');
    } else {
        progressFill.classList.remove('over-budget');
    }
}

// Update category breakdown
function updateCategoryBreakdown() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthExpenses = allExpenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });

    const categoryTotals = {};
    monthExpenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const totalSpent = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const container = document.getElementById('categoryBreakdown');

    if (Object.keys(categoryTotals).length === 0) {
        container.innerHTML = '<p class="no-data">No data available</p>';
        return;
    }

    container.innerHTML = Object.entries(categoryTotals).map(([category, amount]) => {
        const percentage = (amount / totalSpent) * 100;
        return `
            <div class="category-item">
                <div class="category-name">${category}</div>
                <div class="category-bar">
                    <div class="category-bar-fill" style="width: ${percentage}%; background-color: ${categoryColors[category]}"></div>
                </div>
                <div class="category-amount">NPR ${amount.toFixed(2)}</div>
            </div>
        `;
    }).join('');
}

// Load category pie chart
function loadCategoryPieChart() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthExpenses = allExpenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });

    const categoryTotals = {};
    monthExpenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    const colors = labels.map(cat => categoryColors[cat]);

    const ctx = document.getElementById('categoryPieChart').getContext('2d');
    
    if (window.categoryPieChartInstance) {
        window.categoryPieChartInstance.destroy();
    }

    window.categoryPieChartInstance = new Chart(ctx, {
        type: 'doughnut',
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
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: NPR ${value.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Load monthly bar chart
function loadMonthlyBarChart() {
    const last6Months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthExpenses = allExpenses.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getMonth() === date.getMonth() && 
                   expDate.getFullYear() === date.getFullYear();
        });

        const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        last6Months.push({
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            amount: total
        });
    }

    const ctx = document.getElementById('monthlyBarChart').getContext('2d');
    
    if (window.monthlyBarChartInstance) {
        window.monthlyBarChartInstance.destroy();
    }

    window.monthlyBarChartInstance = new Chart(ctx, {
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

// Export to CSV
document.getElementById('exportCSV').addEventListener('click', function() {
    if (allExpenses.length === 0) {
        alert('No data to export');
        return;
    }

    let csv = 'Date,Category,Description,Amount\n';
    allExpenses.forEach(exp => {
        csv += `${exp.date},${exp.category},"${exp.description || ''}",${exp.amount}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nepartha_expenses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
});

// Print report
document.getElementById('printReport').addEventListener('click', function() {
    window.print();
});

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

// Load reports on page load
document.addEventListener('DOMContentLoaded', loadReports);