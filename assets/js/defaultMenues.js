const { reports, invoices, sales, categories, vendors } = require('./menuItems');
const adminMenu = [
    reports,
    invoices,
    sales,
    categories,
    vendors
];

const supplierMenu = [
    reports
];

const cashierMenu = [
    invoices
];

const guestMenu = [
    vendors
];

module.exports = { adminMenu, supplierMenu, cashierMenu, guestMenu } ;
