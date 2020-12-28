const { reports, invoices, sales, categories, vendors, requests, tenders, employees } = require('./menuItems');
const managerMenu = [
    reports,
    invoices,
    sales,
    categories,
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
