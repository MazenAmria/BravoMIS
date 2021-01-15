const { reports, invoices, sales, categories, vendors, requests, tenders, employees, customers, vendingProcesses } = require('./menuItems');
const managerMenu = [
    reports,
    invoices,
    sales,
    categories,
    customers,
    requests,
    employees
];

const vendingManagerMenu = [
    requests,
    tenders,
    vendors,
    vendingProcesses
];

const cashierMenu = [
    invoices
];

const guestMenu = [
    vendors
];

module.exports = { managerMenu, vendingManagerMenu, cashierMenu, guestMenu } ;
