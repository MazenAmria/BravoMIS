const { reports, invoices, sales, categories, vendors, requests, tenders, employees, customers } = require('./menuItems');
const managerMenu = [
    reports,
    invoices,
    sales,
    categories,
    customers,
    requests,
    vendors,
    employees
];

const vendingManagerMenu = [
    requests,
    tenders,
    vendors
];

const cashierMenu = [
    invoices
];

const guestMenu = [
    vendors
];

module.exports = { managerMenu, vendingManagerMenu, cashierMenu, guestMenu } ;
