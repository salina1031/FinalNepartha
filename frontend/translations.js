// translations.js - NepArtha Language Translation System

const translations = {
    en: {
        appTitle: "NepArtha",
        appSubtitle: "Expense Management System",
        langButton: "नेपाली",
        menuDashboard: "Dashboard",
        menuAddExpense: "Add Expense",
        menuExpenses: "Expenses",
        menuReports: "Reports",
        pageTitleDashboard: "Dashboard",
        totalSpent: "Total Spent",
        monthlyBudget: "Monthly Budget",
        remaining: "Remaining",
        budgetWarning: "⚠️ Warning: You have exceeded your monthly budget!",
        expensesByCategory: "Expenses by Category",
        monthlyTrend: "Monthly Trend",
        recentTransactions: "Recent Transactions",
        noExpenses: "No expenses recorded yet.",
        pageTitleAdd: "Add New Expense",
        pageTitleEdit: "Edit Expense",
        amount: "Amount (NPR)",
        category: "Category",
        description: "Description",
        date: "Date",
        descriptionPlaceholder: "Optional description",
        submitAdd: "➕ Add Expense",
        submitUpdate: "✏️ Update Expense",
        cancel: "❌ Cancel",
        successAdd: "Expense added successfully!",
        successUpdate: "Expense updated successfully!",
        errorRequired: "Please fill in all required fields",
        errorAmount: "Amount must be greater than 0",
        errorSave: "Failed to save expense",
        errorServer: "Error connecting to server",
        catFood: "🍔 Food",
        catTransport: "🚗 Transport",
        catEducation: "📚 Education",
        catEntertainment: "🎮 Entertainment",
        catShopping: "🛍️ Shopping",
        catHealth: "🏥 Health",
        catBills: "📄 Bills",
        catOthers: "📌 Others",
        pageTitleExpenses: "All Expenses",
        filterCategory: "Filter by Category:",
        filterMonth: "Filter by Month:",
        allCategories: "All Categories",
        allMonths: "All Months",
        tableDate: "Date",
        tableCategory: "Category",
        tableDescription: "Description",
        tableAmount: "Amount",
        tableActions: "Actions",
        btnEdit: "✏️ Edit",
        btnDelete: "🗑️ Delete",
        total: "Total:",
        noExpensesFound: "No expenses found",
        confirmDeleteTitle: "Confirm Delete",
        confirmDeleteMsg: "Are you sure you want to delete this expense?",
        btnConfirmDelete: "Delete",
        btnCancelDelete: "Cancel",
        pageTitleReports: "Financial Reports",
        setBudget: "Set Monthly Budget",
        budgetPlaceholder: "Enter budget amount",
        saveBudget: "Save Budget",
        budgetSaved: "Budget saved successfully!",
        budgetError: "Failed to save budget",
        budgetInvalid: "Please enter a valid budget amount",
        budgetLabel: "Monthly Budget:",
        spentLabel: "Total Spent:",
        remainingLabel: "Remaining:",
        categoryBreakdown: "Category Breakdown",
        spendingByCategory: "Spending by Category",
        monthlyComparison: "Monthly Comparison",
        exportData: "Export Data",
        exportCSV: "📥 Export to CSV",
        printReport: "🖨️ Print Report",
        noDataAvailable: "No data available",
        noDataExport: "No data to export",
        chartMonthlyExpenses: "Monthly Expenses",
        chartCurrency: "NPR"
    },

    np: {
        appTitle: "नेपअर्थ",
        appSubtitle: "खर्च व्यवस्थापन प्रणाली",
        langButton: "English",
        menuDashboard: "ड्यासबोर्ड",
        menuAddExpense: "खर्च थप्नुहोस्",
        menuExpenses: "खर्चहरू",
        menuReports: "रिपोर्ट",
        pageTitleDashboard: "ड्यासबोर्ड",
        totalSpent: "कुल खर्च",
        monthlyBudget: "मासिक बजेट",
        remaining: "बाँकी",
        budgetWarning: "⚠️ चेतावनी: तपाईंले आफ्नो मासिक बजेट नाघ्नुभएको छ!",
        expensesByCategory: "श्रेणी अनुसार खर्च",
        monthlyTrend: "मासिक प्रवृत्ति",
        recentTransactions: "हालैका लेनदेन",
        noExpenses: "अहिलेसम्म कुनै खर्च रेकर्ड गरिएको छैन।",
        pageTitleAdd: "नयाँ खर्च थप्नुहोस्",
        pageTitleEdit: "खर्च सम्पादन गर्नुहोस्",
        amount: "रकम (रु.)",
        category: "श्रेणी",
        description: "विवरण",
        date: "मिति",
        descriptionPlaceholder: "वैकल्पिक विवरण",
        submitAdd: "➕ खर्च थप्नुहोस्",
        submitUpdate: "✏️ अपडेट गर्नुहोस्",
        cancel: "❌ रद्द गर्नुहोस्",
        successAdd: "खर्च सफलतापूर्वक थपियो!",
        successUpdate: "खर्च सफलतापूर्वक अपडेट भयो!",
        errorRequired: "कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्",
        errorAmount: "रकम ० भन्दा बढी हुनुपर्छ",
        errorSave: "खर्च बचत गर्न असफल",
        errorServer: "सर्भरमा जडान गर्न त्रुटि",
        catFood: "🍔 खाना",
        catTransport: "🚗 यातायात",
        catEducation: "📚 शिक्षा",
        catEntertainment: "🎮 मनोरञ्जन",
        catShopping: "🛍️ किनमेल",
        catHealth: "🏥 स्वास्थ्य",
        catBills: "📄 बिलहरू",
        catOthers: "📌 अन्य",
        pageTitleExpenses: "सबै खर्चहरू",
        filterCategory: "श्रेणी अनुसार फिल्टर:",
        filterMonth: "महिना अनुसार फिल्टर:",
        allCategories: "सबै श्रेणीहरू",
        allMonths: "सबै महिनाहरू",
        tableDate: "मिति",
        tableCategory: "श्रेणी",
        tableDescription: "विवरण",
        tableAmount: "रकम",
        tableActions: "कार्यहरू",
        btnEdit: "✏️ सम्पादन",
        btnDelete: "🗑️ मेटाउनुहोस्",
        total: "जम्मा:",
        noExpensesFound: "कुनै खर्च फेला परेन",
        confirmDeleteTitle: "मेटाउने पुष्टि गर्नुहोस्",
        confirmDeleteMsg: "के तपाईं यो खर्च मेटाउन निश्चित हुनुहुन्छ?",
        btnConfirmDelete: "मेटाउनुहोस्",
        btnCancelDelete: "रद्द गर्नुहोस्",
        pageTitleReports: "वित्तीय रिपोर्टहरू",
        setBudget: "मासिक बजेट सेट गर्नुहोस्",
        budgetPlaceholder: "बजेट रकम प्रविष्ट गर्नुहोस्",
        saveBudget: "बजेट बचत गर्नुहोस्",
        budgetSaved: "बजेट सफलतापूर्वक बचत भयो!",
        budgetError: "बजेट बचत गर्न असफल",
        budgetInvalid: "कृपया मान्य बजेट रकम प्रविष्ट गर्नुहोस्",
        budgetLabel: "मासिक बजेट:",
        spentLabel: "कुल खर्च:",
        remainingLabel: "बाँकी:",
        categoryBreakdown: "श्रेणी विभाजन",
        spendingByCategory: "श्रेणी अनुसार खर्च",
        monthlyComparison: "मासिक तुलना",
        exportData: "डाटा निर्यात गर्नुहोस्",
        exportCSV: "📥 CSV मा निर्यात",
        printReport: "🖨️ रिपोर्ट प्रिन्ट",
        noDataAvailable: "कुनै डाटा उपलब्ध छैन",
        noDataExport: "निर्यात गर्न कुनै डाटा छैन",
        chartMonthlyExpenses: "मासिक खर्चहरू",
        chartCurrency: "रु."
    }
};

// ─── Core ─────────────────────────────────────────────────────────────────────

let currentLang = localStorage.getItem('nepartha_language') || 'en';

function t(key) {
    return translations[currentLang][key] || key;
}

function switchLanguage() {
    currentLang = currentLang === 'en' ? 'np' : 'en';
    localStorage.setItem('nepartha_language', currentLang);
    updatePageLanguage();
}

// ─── Update all page text ─────────────────────────────────────────────────────

function updatePageLanguage() {
    const appTitle    = document.querySelector('.logo h1');
    const appSubtitle = document.querySelector('.logo p');
    const langBtn     = document.getElementById('langToggle');
    if (appTitle)    appTitle.textContent    = t('appTitle');
    if (appSubtitle) appSubtitle.textContent = t('appSubtitle');
    if (langBtn)     langBtn.textContent     = t('langButton');

    const menuItems = document.querySelectorAll('.menu-item');
    if (menuItems.length >= 4) {
        menuItems[0].textContent = t('menuDashboard');
        menuItems[1].textContent = t('menuAddExpense');
        menuItems[2].textContent = t('menuExpenses');
        menuItems[3].textContent = t('menuReports');
    }

    const page = window.location.pathname.split('/').pop();
    if (page === 'index.html' || page === '') {
        updateDashboardLanguage();
    } else if (page === 'addExpenses.html') {
        updateAddExpenseLanguage();
    } else if (page === 'expenses.html') {
        updateExpensesLanguage();
    } else if (page === 'report.html') {
        updateReportsLanguage();
    }
}

function updateDashboardLanguage() {
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) pageTitle.textContent = t('pageTitleDashboard');

    const cardLabels = document.querySelectorAll('.card-label');
    if (cardLabels.length >= 3) {
        cardLabels[0].textContent = t('totalSpent');
        cardLabels[1].textContent = t('monthlyBudget');
        cardLabels[2].textContent = t('remaining');
    }

    const warning = document.getElementById('budgetWarning');
    if (warning) warning.textContent = t('budgetWarning');

    const sections = document.querySelectorAll('.section-title');
    if (sections.length >= 3) {
        sections[0].textContent = t('expensesByCategory');
        sections[1].textContent = t('monthlyTrend');
        sections[2].textContent = t('recentTransactions');
    }
}

function updateAddExpenseLanguage() {
    const isEditing = new URLSearchParams(window.location.search).has('edit');

    const formTitle = document.getElementById('formTitle');
    if (formTitle) formTitle.textContent = isEditing ? t('pageTitleEdit') : t('pageTitleAdd');

    const labels = document.querySelectorAll('.form-group label');
    if (labels.length >= 4) {
        labels[0].textContent = t('amount') + ' *';
        labels[1].textContent = t('category') + ' *';
        labels[2].textContent = t('description');
        labels[3].textContent = t('date') + ' *';
    }

    const descInput = document.getElementById('description');
    if (descInput) descInput.placeholder = t('descriptionPlaceholder');

    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) submitBtn.textContent = isEditing ? t('submitUpdate') : t('submitAdd');

    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) cancelBtn.textContent = t('cancel');

    const categorySelect = document.getElementById('category');
    if (categorySelect) {
        const keys = ['catFood','catTransport','catEducation','catEntertainment',
                      'catShopping','catHealth','catBills','catOthers'];
        keys.forEach((key, i) => {
            if (categorySelect.options[i]) categorySelect.options[i].text = t(key);
        });
    }
}

function updateExpensesLanguage() {
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) pageTitle.textContent = t('pageTitleExpenses');

    const filterLabels = document.querySelectorAll('.filter-group label');
    if (filterLabels.length >= 2) {
        filterLabels[0].textContent = t('filterCategory');
        filterLabels[1].textContent = t('filterMonth');
    }

    const catFilter = document.getElementById('filterCategory');
    if (catFilter && catFilter.options.length > 0) {
        catFilter.options[0].text = t('allCategories');
        const keys = ['catFood','catTransport','catEducation','catEntertainment',
                      'catShopping','catHealth','catBills','catOthers'];
        keys.forEach((key, i) => {
            if (catFilter.options[i + 1]) catFilter.options[i + 1].text = t(key);
        });
    }

    const monthFilter = document.getElementById('filterMonth');
    if (monthFilter && monthFilter.options.length > 0) {
        monthFilter.options[0].text = t('allMonths');
    }

    const ths = document.querySelectorAll('.expenses-table th');
    if (ths.length >= 5) {
        ths[0].textContent = t('tableDate');
        ths[1].textContent = t('tableCategory');
        ths[2].textContent = t('tableDescription');
        ths[3].textContent = t('tableAmount');
        ths[4].textContent = t('tableActions');
    }

    const modalTitle = document.querySelector('.modal-content h3');
    if (modalTitle) modalTitle.textContent = t('confirmDeleteTitle');

    const modalText = document.querySelector('.modal-content p');
    if (modalText) modalText.textContent = t('confirmDeleteMsg');

    const confirmBtn = document.getElementById('confirmDeleteBtn');
    if (confirmBtn) confirmBtn.textContent = t('btnConfirmDelete');

    const cancelBtn = document.getElementById('cancelDelete');
    if (cancelBtn) cancelBtn.textContent = t('btnCancelDelete');

    const footerLabel = document.querySelector('.summary-footer strong');
    if (footerLabel) footerLabel.textContent = t('total');
}

function updateReportsLanguage() {
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) pageTitle.textContent = t('pageTitleReports');

    const sections = document.querySelectorAll('.section-title');
    if (sections.length >= 5) {
        sections[0].textContent = t('setBudget');
        sections[1].textContent = t('categoryBreakdown');
        sections[2].textContent = t('spendingByCategory');
        sections[3].textContent = t('monthlyComparison');
        sections[4].textContent = t('exportData');
    }

    const budgetInput = document.getElementById('budgetInput');
    if (budgetInput) budgetInput.placeholder = t('budgetPlaceholder');

    const saveBudgetBtn = document.getElementById('saveBudget');
    if (saveBudgetBtn) saveBudgetBtn.textContent = t('saveBudget');

    const budgetLabels = document.querySelectorAll('.budget-item .budget-label');
    if (budgetLabels.length >= 3) {
        budgetLabels[0].textContent = t('budgetLabel');
        budgetLabels[1].textContent = t('spentLabel');
        budgetLabels[2].textContent = t('remainingLabel');
    }

    const exportBtn = document.getElementById('exportCSV');
    if (exportBtn) exportBtn.textContent = t('exportCSV');

    const printBtn = document.getElementById('printReport');
    if (printBtn) printBtn.textContent = t('printReport');
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
    updatePageLanguage();
    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
        langBtn.addEventListener('click', switchLanguage);
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { t, switchLanguage, currentLang };
}