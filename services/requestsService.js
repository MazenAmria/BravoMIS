const db = require('../dbConnection');

const getAllUnresolvedRequests = function getAllUnresolvedRequests(callback) {
    db.query(`SELECT * FROM vending_request WHERE status LIKE 'requested';`, (err, results) => {
        if (err) callback(err, null);
        callback(null, results);
    });
}

const getOwnUnresolvedRequests = function getOwnUnresolvedRequests(username, callback) {
    db.query(`SELECT * FROM vending_request WHERE manager_id LIKE '${username}' AND status LIKE 'requested';`, (err, results) => {
        if (err) callback(err, null);
        callback(null, results);
    });
}

const getOwnResolvedRequests = function getOwnResolvedRequests(username, callback) {
    db.query(`SELECT * FROM vending_request WHERE manager_id LIKE '${username}' AND status LIKE 'resolved';`, (err, results) => {
        if (err) callback(err, null);
        callback(null, results);
    });
}

const getAssignedRequests = function getAssignedRequests(username, callback) {
    db.query(`SELECT * FROM vending_request WHERE vending_manager_id LIKE '${username}' AND status LIKE 'assigned';`, (err, results) => {
        if (err) callback(err, null);
        callback(null, results);
    });
}

const getResolvedRequests = function getResolvedRequests(username, callback) {
    db.query(`SELECT * FROM vending_request WHERE vending_manager_id LIKE '${username}' AND status LIKE 'resolved';`, (err, results) => {
        if (err) callback(err, null);
        callback(null, results);
    });
}

module.exports = { getAllUnresolvedRequests, getOwnUnresolvedRequests, getOwnResolvedRequests, getAssignedRequests, getResolvedRequests };
