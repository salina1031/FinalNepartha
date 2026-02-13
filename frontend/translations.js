// translations.js - Language Translation System for NepArtha

const translations = {
    en: {
        // Navigation
        appTitle: "NepArtha",
        appSubtitle: "Expense Management System",
        langButton: "नेपाली",
        
        // Menu
        menuDashboard: "Dashboard",
        menuAddExpense: "Add Expense",
        menuExpenses: "Expenses",
        menuReports: "Reports",
        
        // Dashboard
        pageTitleDashboard: "Dashboard",
        totalSpent: "Total Spent",
        monthlyBudget: "Monthly Budget",
        remaining: "Remaining",
        budgetWarning: "⚠️ Warning: You have exceeded your monthly budget!",
        expensesByCategory: "Expenses by Category",
        monthlyTrend: "Monthly Trend",
        recentTransactions: "Recent Transactions",
        noExpenses: "No expenses recorded yet.",
        
        // Add Expense
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
        
        // Categories
        catFood: "🍔 Food",
        catTransport: "🚗 Transport",
        catEducation: "📚 Education",
        catEntertainment: "🎮 Entertainment",
        catShopping: "🛍️ Shopping",
        catHealth: "🏥 Health",
        catBills: "📄 Bills",
        catOthers: "📌 Others",
        
        // Expenses Page
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
        
        // Reports Page
        pageTitleReports: "Financial Reports",
        setBudget: "Set Monthly Budget",
        budgetPlaceholder: "Enter budget amount",
        saveBudget: "Save Budget",
        budgetSaved: "Budget saved successfully!",
        budgetError: "Failed to save budget",
        budgetInvalid: "Please enter a valid budget amount",
        budgetOverview: "Budget Overview",
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
        
        // Months
        monthJan: "Jan",
        monthFeb: "Feb",
        monthMar: "Mar",
        monthApr: "Apr",
        monthMay: "May",
        monthJun: "Jun",
        monthJul: "Jul",
        monthAug: "Aug",
        monthSep: "Sep",
        monthOct: "Oct",
        monthNov: "Nov",
        monthDec: "Dec",
        
        // Chart Labels
        chartMonthlyExpenses: "Monthly Expenses",
        chartCurrency: "NPR"
    },
    
    np: {
        // Navigation
        appTitle: "नेपअर्थ",
        appSubtitle: "खर्च व्यवस्थापन प्रणाली",
        langButton: "English",
        
        // Menu
        menuDashboard: "ड्यासबोर्ड",
        menuAddExpense: "खर्च थप्नुहोस्",
        menuExpenses: "खर्चहरू",
        menuReports: "रिपोर्ट",
        
        // Dashboard
        pageTitleDashboard: "ड्यासबोर्ड",
        totalSpent: "कुल खर्च",
        monthlyBudget: "मासिक बजेट",
        remaining: "बाँकी",
        budgetWarning: "⚠️ चेतावनी: तपाईंले आफ्नो मासिक बजेट नाघ्नुभएको छ!",
        expensesByCategory: "श्रेणी अनुसार खर्च",
        monthlyTrend: "मासिक प्रवृत्ति",
        recentTransactions: "हालैका लेनदेन",
        noExpenses: "अहिलेसम्म कुनै खर्च रेकर्ड गरिएको छैन।",
        
        // Add Expense
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
        
        // Categories
        catFood: "🍔 खाना",
        catTransport: "🚗 यातायात",
        catEducation: "📚 शिक्षा",
        catEntertainment: "🎮 मनोरञ्जन",
        catShopping: "🛍️ किनमेल",
        catHealth: "🏥 स्वास्थ्य",
        catBills: "📄 बिलहरू",
        catOthers: "📌 अन्य",
        
        // Expenses Page
        pageTitleExpenses: "सबै खर्चहरू",
        filterCategory: "श्रेणी अनुसार फिल्टर गर्नुहोस्:",
        filterMonth: "महिना अनुसार फिल्टर गर्नुहोस्:",
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
        
        // Reports Page
        pageTitleReports: "वित्तीय रिपोर्टहरू",
        setBudget: "मासिक बजेट सेट गर्नुहोस्",
        budgetPlaceholder: "बजेट रकम प्रविष्ट गर्नुहोस्",
        saveBudget: "बजेट बचत गर्नुहोस्",
        budgetSaved: "बजेट सफलतापूर्वक बचत भयो!",
        budgetError: "बजेट बचत गर्न असफल",
        budgetInvalid: "कृपया मान्य बजेट रकम प्रविष्ट गर्नुहोस्",
        budgetOverview: "बजेट सिंहावलोकन",
        budgetLabel: "मासिक बजेट:",
        spentLabel: "कुल खर्च:",
        remainingLabel: "बाँकी:",
        categoryBreakdown: "श्रेणी विभाजन",
        spendingByCategory: "श्रेणी अनुसार खर्च",
        monthlyComparison: "मासिक तुलना",
        exportData: "डाटा निर्यात गर्नुहोस्",
        exportCSV: "📥 CSV मा निर्यात गर्नुहोस्",
        printReport: "🖨️ रिपोर्ट प्रिन्ट गर्नुहोस्",
        noDataAvailable: "कुनै डाटा उपलब्ध छैन",
        noDataExport: "निर्यात गर्न कुनै डाटा छैन",
        
        // Months
        monthJan: "जनवरी",
        monthFeb: "फेब्रुअरी",
        monthMar: "मार्च",
        monthApr: "अप्रिल",
        monthMay: "मे",
        monthJun: "जुन",
        monthJul: "जुलाई",
        monthAug: "अगस्ट",
        monthSep: "सेप्टेम्बर",
        monthOct: "अक्टोबर",
        monthNov: "नोभेम्बर",
        monthDec: "डिसेम्बर",
        
        // Chart Labels
        chartMonthlyExpenses: "मासिक खर्चहरू",
        chartCurrency: "रु."
    }
};

// Get current language from localStorage or default to 'en'
let currentLang = localStorage.getItem('nepartha_language') || 'en';

// Function to get translation
function t(key) {
    return translations[currentLang][key] || key;
}

// Function to switch language
function switchLanguage() {
    currentLang = currentLang === 'en' ? 'np' : 'en';
    localStorage.setItem('nepartha_language', currentLang);
    updatePageLanguage();
}

// Function to update all text on the page
function updatePageLanguage() {
    // Update navigation
    const appTitle = document.querySelector('.logo h1');
    const appSubtitle = document.querySelector('.logo p');
    const langButton = document.getElementById('langToggle');
    
    if (appTitle) appTitle.textContent = t('appTitle');
    if (appSubtitle) appSubtitle.textContent = t('appSubtitle');
    if (langButton) langButton.textContent = t('langButton');
    
    // Update menu items
    const menuItems = document.querySelectorAll('.menu-item');
    if (menuItems.length > 0) {
        menuItems[0].textContent = t('menuDashboard');
        menuItems[1].textContent = t('menuAddExpense');
        menuItems[2].textContent = t('menuExpenses');
        menuItems[3].textContent = t('menuReports');
    }
    
    // Update page-specific content
    updatePageSpecificContent();
}

// Function to update page-specific content
function updatePageSpecificContent() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'index.html' || currentPage === '') {
        updateDashboardLanguage();
    } else if (currentPage === 'add-expense.html') {
        updateAddExpenseLanguage();
    } else if (currentPage === 'expenses.html') {
        updateExpensesLanguage();
    } else if (currentPage === 'reports.html') {
        updateReportsLanguage();
    }
}

// Update Dashboard page language
function updateDashboardLanguage() {
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) pageTitle.textContent = t('pageTitleDashboard');
    
    const cardLabels = document.querySelectorAll('.card-label');
    if (cardLabels.length >= 3) {
        cardLabels[0].textContent = t('totalSpent');
        cardLabels[1].textContent = t('monthlyBudget');
        cardLabels[2].textContent = t('remaining');
    }
    
    const warningDiv = document.getElementById('budgetWarning');
    if (warningDiv) warningDiv.textContent = t('budgetWarning');
    
    const sectionTitles = document.querySelectorAll('.section-title');
    if (sectionTitles.length >= 3) {
        sectionTitles[0].textContent = t('expensesByCategory');
        sectionTitles[1].textContent = t('monthlyTrend');
        sectionTitles[2].textContent = t('recentTransactions');
    }
}

// Update Add Expense page language
function updateAddExpenseLanguage() {
    const formTitle = document.getElementById('formTitle');
    if (formTitle) {
        const isEditing = new URLSearchParams(window.location.search).has('edit');
        formTitle.textContent = isEditing ? t('pageTitleEdit') : t('pageTitleAdd');
    }
    
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
    if (submitBtn) {
        const isEditing = new URLSearchParams(window.location.search).has('edit');
        submitBtn.textContent = isEditing ? t('submitUpdate') : t('submitAdd');
    }
    
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) cancelBtn.textContent = t('cancel');
    
    // Update category options
    const categorySelect = document.getElementById('category');
    if (categorySelect) {
        const options = categorySelect.options;
        options[0].text = t('catFood');
        options[1].text = t('catTransport');
        options[2].text = t('catEducation');
        options[3].text = t('catEntertainment');
        options[4].text = t('catShopping');
        options[5].text = t('catHealth');
        options[6].text = t('catBills');
        options[7].text = t('catOthers');
    }
}

// Update Expenses page language
function updateExpensesLanguage() {
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) pageTitle.textContent = t('pageTitleExpenses');
    
    const filterLabels = document.querySelectorAll('.filter-group label');
    if (filterLabels.length >= 2) {
        filterLabels[0].textContent = t('filterCategory');
        filterLabels[1].textContent = t('filterMonth');
    }
    
    // Update filter dropdowns
    const categoryFilter = document.getElementById('filterCategory');
    if (categoryFilter) {
        const options = categoryFilter.options;
        options[0].text = t('allCategories');
        for (let i = 1; i < options.length; i++) {
            const catValue = options[i].value;
            options[i].text = t('cat' + catValue);
        }
    }
    
    const monthFilter = document.getElementById('filterMonth');
    if (monthFilter && monthFilter.options.length > 0) {
        monthFilter.options[0].text = t('allMonths');
    }
    
    // Update table headers
    const tableHeaders = document.querySelectorAll('.expenses-table th');
    if (tableHeaders.length >= 5) {
        tableHeaders[0].textContent = t('tableDate');
        tableHeaders[1].textContent = t('tableCategory');
        tableHeaders[2].textContent = t('tableDescription');
        tableHeaders[3].textContent = t('tableAmount');
        tableHeaders[4].textContent = t('tableActions');
    }
    
    // Update modal
    const modalTitle = document.querySelector('.modal-content h3');
    if (modalTitle) modalTitle.textContent = t('confirmDeleteTitle');
    
    const modalText = document.querySelector('.modal-content p');
    if (modalText) modalText.textContent = t('confirmDeleteMsg');
    
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    if (confirmDeleteBtn) confirmDeleteBtn.textContent = t('btnConfirmDelete');
    
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    if (cancelDeleteBtn) cancelDeleteBtn.textContent = t('btnCancelDelete');
}

// Update Reports page language
function updateReportsLanguage() {
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) pageTitle.textContent = t('pageTitleReports');
    
    const sectionTitles = document.querySelectorAll('.section-title');
    if (sectionTitles.length >= 5) {
        sectionTitles[0].textContent = t('setBudget');
        sectionTitles[1].textContent = t('categoryBreakdown');
        sectionTitles[2].textContent = t('spendingByCategory');
        sectionTitles[3].textContent = t('monthlyComparison');
        sectionTitles[4].textContent = t('exportData');
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
    
    const exportCSVBtn = document.getElementById('exportCSV');
    if (exportCSVBtn) exportCSVBtn.textContent = t('exportCSV');
    
    const printReportBtn = document.getElementById('printReport');
    if (printReportBtn) printReportBtn.textContent = t('printReport');
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    updatePageLanguage();
    
    // Add event listener to language toggle button
    const langButton = document.getElementById('langToggle');
    if (langButton) {
        langButton.addEventListener('click', switchLanguage);
    }
});

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { t, switchLanguage, currentLang };
}