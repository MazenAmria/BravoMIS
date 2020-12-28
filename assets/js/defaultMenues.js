const { reports, invoices, sales, categories, vendors, employees } = require('./menuItems');
const adminMenu = [
    reports,
    invoices,
    sales,
    categories,
    vendors,
    employees
];

const vendingManagerMenu = [
    reports
];

const cashierMenu = [
    invoices
];

const guestMenu = [
    vendors
];

module.exports = { adminMenu, vendingManagerMenu, cashierMenu, guestMenu } ;
