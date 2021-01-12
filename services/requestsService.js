const db = require('../dbConnection');

const getAllUnassignedRequests = function getAllUnassignedRequests(callback) {
    db.query(`SELECT request_id, CONCAT('api/requests/', request_id) AS requested_items, 
       before_date, offers_deadline, manager_id, CONCAT('api/tenders/new') AS tender
    FROM vending_request WHERE status LIKE 'requested';`, (err, results) => {
        if (err) callback(err, null);
        else callback(null, {
            columns: [
                'المعرّف',
                'قائمة المنتجات',
                'الموعد النهائي لإتمام الاستيراد',
                'الموعد النهائي لتقديم العروض',
                'طلب بوساطة',
                'المناقصة'
            ],
            tuples: results
        });
    });
}

const getOwnUnassignedRequests = function getOwnUnassignedRequests(username, callback) {
    db.query(`SELECT request_id, CONCAT('api/requests/', request_id) AS requested_items, 
    before_date, offers_deadline
    FROM vending_request
    WHERE manager_id LIKE '${username}'
    AND status LIKE 'requested';`, (err, results) => {
        if (err) callback(err, null);
        else callback(null, {
            columns: [
                'المعرّف',
                'قائمة المنتجات',
                'الموعد النهائي لإتمام الاستيراد',
                'الموعد النهائي لتقديم العروض'
            ],
            tuples: results
        });
    });
}

const getUnresolvedRequests = function getUnresolvedRequests(username, callback) {
    db.query(`SELECT VR.request_id, CONCAT('api/requests/', VR.request_id) AS requested_items, 
    VR.before_date, VR.offers_deadline, VR.manager_id, CONCAT('api/offers/', T.tender_id) AS offers
    FROM vending_request VR
    JOIN tender T ON VR.request_id = T.request_id
    WHERE T.vending_manager_id LIKE '${username}'
    AND VR.status LIKE 'assigned';`, (err, results) => {
        if (err) callback(err, null);
        else callback(null, {
            columns: [
                'المعرّف',
                'قائمة المنتجات',
                'الموعد النهائي لإتمام الاستيراد',
                'الموعد النهائي لتقديم العروض',
                'طلب بوساطة',
                'المناقصة'
            ],
            tuples: results
        });
    });
}

const getOwnUnresolvedRequests = function getOwnUnresolvedRequests(username, callback) {
    db.query(`SELECT VR.request_id, CONCAT('api/requests/', VR.request_id) AS requested_items, 
    VR.before_date, VR.offers_deadline, T.vending_manager_id, CONCAT('api/offers/', T.tender_id) AS offers
    FROM vending_request VR
    JOIN tender T ON VR.request_id = T.request_id
    WHERE VR.manager_id LIKE '${username}'
    AND VR.status LIKE 'assigned';`, (err, results) => {
        if (err) callback(err, null);
        else callback(null, {
            columns: [
                'المعرّف',
                'قائمة المنتجات',
                'الموعد النهائي لإتمام الاستيراد',
                'الموعد النهائي لتقديم العروض',
                'المشرف',
                'المناقصة'
            ],
            tuples: results
        });
    });
}

const getResolvedRequests = function getResolvedRequests(username, callback) {
    db.query(`SELECT VR.request_id, CONCAT('api/requests/', VR.request_id) AS requested_items,
    VR.before_date, VR.offers_deadline, VR.manager_id, CONCAT('api/offers/', T.tender_id) AS offers
    FROM vending_request VR
    JOIN tender T ON VR.request_id = T.request_id
    WHERE T.vending_manager_id LIKE '${username}'
    AND VR.status LIKE 'resolved';`, (err, results) => {
        if (err) callback(err, null);
        else callback(null, {
            columns: [
                'المعرّف',
                'قائمة المنتجات',
                'الموعد النهائي لإتمام الاستيراد',
                'الموعد النهائي لتقديم العروض',
                'طلب بوساطة',
                'المناقصة'
            ],
            tuples: results
        });
    });
}

const getOwnResolvedRequests = function getOwnResolvedRequests(username, callback) {
    db.query(`SELECT VR.request_id, CONCAT('api/requests/', VR.request_id) AS requested_items,
    VR.before_date, VR.offers_deadline, T.vending_manager_id, CONCAT('api/offers/', T.tender_id) AS offersr
    FROM vending_request VR
    JOIN tender T ON VR.request_id = T.request_id
    WHERE VR.manager_id LIKE '${username}'
    AND VR.status LIKE 'resolved';`, (err, results) => {
        if (err) callback(err, null);
        else callback(null, {
            columns: [
                'المعرّف',
                'قائمة المنتجات',
                'الموعد النهائي لإتمام الاستيراد',
                'الموعد النهائي لتقديم العروض',
                'المشرف',
                'المناقصة'
            ],
            tuples: results
        });
    });
}

const getRequestItems = function getRequestItems(requestId, callback) {
    db.query(`SELECT VI.item_id, I.item_name, VI.quantity 
    FROM vending_request_items VI
    JOIN item I on VI.item_id LIKE I.item_id
    WHERE VI.request_id = ${requestId}`, (err, results) => {
        if (err) callback(err, null);
        else callback(null, {
            columns: [
                'معرّف المنتج',
                'اسم المنتج',
                'الكمية المطلوبة'
            ],
            tuples: results
        });
    });
}

module.exports = {
    getAllUnassignedRequests,
    getOwnUnassignedRequests,
    getUnresolvedRequests,
    getOwnUnresolvedRequests,
    getResolvedRequests,
    getOwnResolvedRequests,
    getRequestItems
};
