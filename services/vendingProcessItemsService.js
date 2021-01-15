const db = require('../dbConnection');

const getItemsByProcess = function getItemsByProcess(process_id, callback) {
    db.query(`

        SELECT item_id,
               quantity,
               vending_price,
               production_date,
               expiry_date
        FROM vending_process_items
        WHERE process_id = ?;
    
    `, [process_id], (err, result) => {
        if (err) callback(err, null);
        else callback(null, {
            columns: [
                'المعرّف',
                'الكمية',
                'السعر',
                'تاريخ الانتاج',
                'تاريخ الانتهاء'
            ],
            tuples: result
        });
    });
}

module.exports = {
    getItemsByProcess
}
