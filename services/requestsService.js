const db = require('../dbConnection');

const getAllRequests = function getAllRequests(callback) {
    db.query(`SELECT * FROM vending_request;`, (err, results) => {
        if (err) callback(err, null);
        callback(null, [{Test: 'Hello'}, {Test: 'Gelllo'}]);
    });
}

module.exports = { getAllRequests };
