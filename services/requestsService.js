const db = require('../dbConnection');

const getAllRequests = function getAllRequests(callback) {
    db.query(`SELECT * FROM vending_request;`, (err, results) => {
        if (err) callback(err, null);
        callback(null, [
            {Test1: 'Test', Test2: 'Test', Test3: 'Test', Test4: 'Test'},
            {Test1: 'Test', Test2: 'Test', Test3: 'Test', Test4: 'Test'},
            {Test1: 'Test', Test2: 'Test', Test3: 'Test', Test4: 'Test'},
            {Test1: 'Test', Test2: 'Test', Test3: 'Test', Test4: 'Test'},
            {Test1: 'Test', Test2: 'Test', Test3: 'Test', Test4: 'Test'},
            {Test1: 'Test', Test2: 'Test', Test3: 'Test', Test4: 'Test'},
            {Test1: 'Test', Test2: 'Test', Test3: 'Test', Test4: 'Test'}
        ]);
    });
}

module.exports = { getAllRequests };
