const db = require('../dbConnection');

const getAllUnassignedRequests = function getAllUnassignedRequests(callback) {
    db.query(`

        SELECT request_id, 
               CONCAT('api/requests/', request_id) AS requested_items, 
               before_date, 
               manager_id, 
               CONCAT('api/tenders/new') AS tender
        FROM vending_request 
        WHERE status LIKE 'requested';

    `, (err, results) => {
        if (err) callback(err, null);
        else callback(null, {
            columns: [
                'المعرّف',
                'قائمة المنتجات',
                'الموعد النهائي لإتمام الاستيراد',
                'طلب بوساطة',
                'المناقصة'
            ],
            tuples: results
        });
    });
}

const getOwnUnassignedRequests = function getOwnUnassignedRequests(username, callback) {
    db.query(`

        SELECT request_id, 
               CONCAT('api/requests/', request_id) AS requested_items, 
               before_date
        FROM vending_request
        WHERE manager_id LIKE ?
        AND status LIKE 'requested';

    `, [username], (err, results) => {
        if (err) callback(err, null);
        else callback(null, {
            columns: [
                'المعرّف',
                'قائمة المنتجات',
                'الموعد النهائي لإتمام الاستيراد'
            ],
            tuples: results
        });
    });
}

const getUnresolvedRequests = function getUnresolvedRequests(username, callback) {
    db.query(`

        SELECT VR.request_id, 
               CONCAT('api/requests/', VR.request_id) AS requested_items, 
               VR.before_date, 
               T.deadline, 
               VR.manager_id, 
               CONCAT('api/offers/', T.tender_id) AS offers
        FROM vending_request VR
        JOIN tender T ON VR.request_id = T.request_id
        WHERE T.vending_manager_id LIKE ?
        AND VR.status LIKE 'assigned';
    
    `, [username], (err, results) => {
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
    db.query(`

        SELECT VR.request_id, 
               CONCAT('api/requests/', VR.request_id) AS requested_items,
               VR.before_date, 
               T.deadline, 
               T.vending_manager_id, 
               CONCAT('api/offers/', T.tender_id) AS offers
        FROM vending_request VR
        JOIN tender T ON VR.request_id = T.request_id
        WHERE VR.manager_id LIKE ?
        AND VR.status LIKE 'assigned';
    
    `, [username], (err, results) => {
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
    db.query(`

        SELECT VR.request_id, 
               CONCAT('api/requests/', VR.request_id) AS requested_items,
               VR.before_date, 
               T.deadline, 
               VR.manager_id, CONCAT('api/offers/', T.tender_id) AS offers
        FROM vending_request VR
        JOIN tender T ON VR.request_id = T.request_id
        WHERE T.vending_manager_id LIKE ?
        AND VR.status LIKE 'resolved';
    
    `, [username], (err, results) => {
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
    db.query(`

        SELECT VR.request_id, 
               CONCAT('api/requests/', VR.request_id) AS requested_items,
               VR.before_date, 
               T.deadline, 
               T.vending_manager_id, 
               CONCAT('api/offers/', T.tender_id) AS offers
        FROM vending_request VR
        JOIN tender T ON VR.request_id = T.request_id
        WHERE VR.manager_id LIKE ?
        AND VR.status LIKE 'resolved';
        
    `, [username], (err, results) => {
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
    db.query(`

        SELECT VI.item_id, 
               I.item_name, 
               VI.quantity 
        FROM vending_request_items VI
        JOIN item I on VI.item_id LIKE I.item_id
        WHERE VI.request_id = ?
    
    `, [requestId], (err, results) => {
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

const addRequest = function addRequest(request, items, callback) {
    db.query(`

        INSERT INTO vending_request 
        SET ?

    `, request, (err, result) => {
        if (err) callback(err);
        else {
            items = items.map(item => [result.insertId, item[0], item[2]]);
            db.query(`

                INSERT INTO vending_request_items
                VALUES ?
                
            `, [items], (err, results) => {
                if (err) callback(err);
                else callback(null);
            });
        }
    });
}

module.exports = {
    getAllUnassignedRequests,
    getOwnUnassignedRequests,
    getUnresolvedRequests,
    getOwnUnresolvedRequests,
    getResolvedRequests,
    getOwnResolvedRequests,
    getRequestItems,
    addRequest
};
