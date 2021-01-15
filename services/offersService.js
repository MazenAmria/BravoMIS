const db = require('../dbConnection');

const getOffersByRequestId = function getOffersByRequestId(tenderId, callback) {
    db.query(`
    
        SELECT offer_id, 
               vending_price, 
               vending_date, 
               submission_time 
        FROM offer 
        WHERE request_id = ?;
    
    `, [tenderId], (err, results) => {
        if (err) callback(err, null);
        callback(null, {
            columns: [
                'المعرّف',
                'سعر التوريد',
                'وقت التقديم'
            ],
            tuples: results
        });
    });
}

module.exports = { getOffersByRequestId }
