const db = require('../dbConnection');

const getOpenTenders = function getOpenTenders(username, callback) {
    db.query(`
    SELECT T.tender_id, T.creation_time, T.deadline, CONCAT('api/offers/', T.tender_id) AS offers
    FROM tender T
    WHERE T.vending_manager_id LIKE '${username}' 
    AND status LIKE 'open';
    `, (err, results) => {
        if (err) callback(err, null);
        callback(null, {
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
    SELECT T.tender_id, T.creation_time, T.deadline, CONCAT('api/offers/', T.tender_id) AS offers
    FROM tender T
    WHERE T.vending_manager_id LIKE '${username}' 
    AND status LIKE 'closed';
    `, (err, results) => {
        if (err) callback(err, null);
        callback(null, {
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
    SELECT T.tender_id, T.creation_time, T.deadline, T.vending_manager_id, CONCAT('api/offers/', T.tender_id) AS offers
    FROM tender T
    WHERE status LIKE 'resolved';
    `, (err, results) => {
        if (err) callback(err, null);
        callback(null, {
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

module.exports = { getOpenTenders, getClosedTenders, getResolvedTenders };
