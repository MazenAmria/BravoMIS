const db = require('../dbConnection');

const getOffersByTenderId = function getOffersByTenderId(tenderId, callback) {
    db.query(`SELECT offer_id, vending_price, vending_date, submission_time FROM offer WHERE tender_id = '${tenderId}';`, (err, results) => {
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

module.exports = { getOffersByTenderId }
