const { reports, invoices, sales, categories, vendors } = require('./menuItems');
const adminMenu = [
    reports,
    invoices,
    sales,
    categories,
    vendors
];

module.exports = { adminMenu };
