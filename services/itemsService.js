const db = require('../dbConnection');

const getAllItems = function getAllItems(callback) {
    db.query(`

        SELECT item_id, 
               item_name, 
               remaining_quantity
        FROM item;
    
    `, (err, result) => {
        if (err) callback(err, null);
        else callback(null, {
           columns: [
               'المعرّف',
               'اسم المنتج',
               'الكمية المتبقية'
           ],
           tuples: result
        });
    });
}

const getItemByID = function getItemByID(itemId, callback) {
    db.query(`
    
        SELECT item_id, 
               item_name, 
               remaining_quantity
        FROM item 
        WHERE item_id LIKE ?;
    
    `, [itemId], (err, result) => {
        if (err) callback(err, null);
        else callback(null, result[0]);
    });
}

module.exports = {
    getAllItems,
    getItemByID
}
