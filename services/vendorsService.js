const db = require('../dbConnection');

const getAllVendors = function getAllVendors(callback) {
    db.query(`

        SELECT vendor_id, 
               vendor_name, 
               vendor_location,
               CONCAT('api/vending-processes/vendor/', vendor.vendor_id) AS vending_processes
        FROM vendor;
    
    `, (err, result) => {
        if (err) callback(err, null);
        else callback(null, {
            columns: [
                'المعرّف',
                'اسم المورّد',
                'العنوان',
                'سجل الاستيراد'
            ],
            tuples: result
        });
    });
}

const addVendor = function addVendor(vendor, callback) {
    db.query(`
    
        INSERT INTO vendor
        SET secret_key = SHA2(CONCAT(NOW(), RAND(), UUID()), 512), ?
    
    `, [vendor], (err) => {
        if (err) callback(err);
        else callback(null);
    });
}

module.exports = {
    getAllVendors,
    addVendor
}
