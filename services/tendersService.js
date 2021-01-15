const db = require('../dbConnection');
const dbMulti = require('../dbConnectionMulti');

const getOpenTenders = function getOpenTenders(username, callback) {
    db.query(`

        SELECT T.request_id, 
               T.creation_time, 
               T.deadline, 
               CONCAT('api/offers/', T.request_id) AS offers
        FROM tender T
        WHERE T.vending_manager_id LIKE ? 
        AND status LIKE 'open';

    `, [username], (err, results) => {
        if (err) callback(err, null);
        else callback(null, {
            columns: [
                'المعرّف',
                'وقت الإنشاء',
                'الموعد النهائي لتقديم العروض',
                'العروض المقدمة'
            ],
            tuples: results
        });
    });
}

const getClosedTenders = function getClosedTenders(username, callback) {
    db.query(`

        SELECT T.request_id, 
               T.creation_time, 
               T.deadline, 
               CONCAT('api/offers/', T.request_id) AS offers
        FROM tender T
        WHERE T.vending_manager_id LIKE ?
        AND status LIKE 'closed';

    `, [username], (err, results) => {
        if (err) callback(err, null);
        else callback(null, {
            columns: [
                'المعرّف',
                'وقت الإنشاء',
                'الموعد النهائي لتقديم العروض',
                'العروض المقدمة'
            ],
            tuples: results
        });
    });
}

const getResolvedTenders = function getResolvedTenders(callback) {
    db.query(`

        SELECT T.request_id, 
               T.creation_time, 
               T.deadline, 
               T.vending_manager_id, 
               CONCAT('api/offers/', T.request_id) AS offers
        FROM tender T
        WHERE status LIKE 'resolved';

    `, (err, results) => {
        if (err) callback(err, null);
        else callback(null, {
            columns: [
                'المعرّف',
                'وقت الإنشاء',
                'الموعد النهائي لتقديم العروض',
                'المشرف',
                'العروض المقدمة'
            ],
            tuples: results
        });
    });
}

const createNewTender = function createNewTender(tender, callback) {
    db.query(`

        SELECT status
        FROM vending_request
        WHERE request_id = ?;

    `, [tender.request_id], (err, result) => {
        if (err) callback(err);
        else if (result[0].status === 'requested') {
            dbMulti.query(`
        
                INSERT INTO tender
                SET secret_key = SHA2(CONCAT(NOW(), RAND(), UUID()), 512), ?;
                UPDATE vending_request
                SET status = 'assigned'
                WHERE request_id = ?;
        
            `, [tender, tender.request_id], (err, result) => {
                if (err) callback(err);
                else callback(null);
            });
        } else callback('Duplicate');
    });
}

const getOffersSubmissionUrls = function getOffersSubmissionUrls(request_id, callback) {
    db.query(`

        SELECT V.vendor_id,
               CONCAT('/api/offers/submit/', 
                   T.request_id, '/', 
                   V.vendor_id, '/', 
                   SHA2(CONCAT(T.secret_key, V.secret_key), 256)) AS submit_offer
        FROM vendor V
        CROSS JOIN tender T
        WHERE T.request_id = ?

    `, [request_id], (err, result) => {
        if (err) callback(err, null);
        else callback(null, {
            columns: [
                'المورّد',
                'رابط تقديم العروض'
            ],
            tuples: result
        });
    });
}

module.exports = {
    getOpenTenders,
    getClosedTenders,
    getResolvedTenders,
    createNewTender,
    getOffersSubmissionUrls
};
