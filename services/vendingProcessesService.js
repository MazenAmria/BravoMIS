const db = require('../dbConnection');
const dbMulti = require('../dbConnectionMulti');
const mysql = require("mysql2");

const getAllProcesses = function getAllProcesses(callback) {
    db.query(`

        SELECT process_id,
               vending_date,
               vendor_id,
               vending_manager_id,
               CONCAT('api/process-items/', process_id) AS process_items
        FROM vending_process;
    
    `, (err, result) => {
        if (err) callback(err, null);
        else callback(null, {
            columns: [
                'المعرّف',
                'تاريخ الاستيراد',
                'المورّد',
                'المشرف',
                'قائمة المنتجات'
            ],
            tuples: result
        });
    });
}

const getProcessesByManager = function getProcessesByManager(username, callback) {
    db.query(`

        SELECT process_id,
               vending_date,
               vendor_id,
               CONCAT('api/process-items/', process_id) AS process_items
        FROM vending_process
        WHERE vending_manager_id = ?;
    
    `, [username],(err, result) => {
        if (err) callback(err, null);
        else callback(null, {
            columns: [
                'المعرّف',
                'تاريخ الاستيراد',
                'المورّد',
                'قائمة المنتجات'
            ],
            tuples: result
        });
    });
}

const getProcessesByVendor = function getProcessesByVendor(vendor_id, callback) {
    db.query(`

        SELECT process_id,
               vending_date,
               vending_manager_id
        FROM vending_process
        WHERE vendor_id = ?;
    
    `, [vendor_id],(err, result) => {
        if (err) callback(err, null);
        else callback(null, {
            columns: [
                'المعرّف',
                'تاريخ الاستيراد',
                'المشرف'
            ],
            tuples: result
        });
    });
}

const addProcess = function addProcess(process, items, callback) {
    db.query(`

        INSERT INTO vending_process
        SET ?
    
    `, [process], (err, result) => {
        if (err) callback(err);
        else {
            for (let item of items) item.unshift(result.insertId);
            db.query(`
            
                INSERT INTO vending_process_items
                VALUES ?
            
            `, [items], (err) => {
                if (err) callback(err);
                else {
                    queries = '';
                    items.forEach(item => {
                        queries += mysql.format("UPDATE item SET remaining_quantity = (remaining_quantity + ?) WHERE item_id = ?; ", [item[2], item[1]]);
                    });
                    dbMulti.query(queries,(err) => {
                        if (err) callback(err);
                        else callback(null);
                    });
                }
            });
        }
    });
}

module.exports = {
    getAllProcesses,
    getProcessesByManager,
    getProcessesByVendor,
    addProcess
}
