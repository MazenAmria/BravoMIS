const mysql = require("mysql2");
const express = require("express");
jjj
// express app
const app = express();

// register view engine
app.set('view engine', 'ejs');

// listen for request
app.listen(3000);

// Middleware & Static Files
app.use(express.static('assets'));
app.use(express.urlencoded({extended:true}));

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "test"
});

con.connect(function(err) {
    if (err) throw err;
    console.log('connected');
});

app.get('/', (_req, res) => {
    con.query('SELECT * FROM items', (err, result, fields) => {
        if(err) res.status(500).send(err);
        else{
            let columns = [];
            for(let i = 0; i < fields.length; i++){
                columns.push(fields[i].name);
            }
            res.render('prototype', {tableData:result , tableColumns:columns});
        }
    });
});

app.post('/edit', (req, res) => {
    const editobj = req.body;
    let itemId = parseInt(editobj.itemId),
        price = parseInt(editobj.price),
        quantity = parseInt(editobj.quantity),
        itemName = editobj.itemName;

    con.query(
        `UPDATE items SET itemName = '${itemName}', price = ${price}, quantity = ${quantity} WHERE itemId = ${itemId};`,
        (err) => {
            if(err) res.status(500).send(err);
            else res.end();
        }
    );
});
app.post('/add', (req, res) => {
    const editobj = req.body;
    let itemId = parseInt(editobj.itemId),
        price = parseInt(editobj.price),
        quantity = parseInt(editobj.quantity),
        itemName = editobj.itemName;
        
    con.query(
        `INSERT INTO items (itemName, itemId, price, quantity) VALUES('${itemName}', ${itemId}, ${price}, ${quantity})`,
        (err) => {
            if(err) res.status(500).send(err);
            else res.end();
        }        
    );
});
app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    con.query(
        `DELETE FROM items WHERE itemId = ${id};`,
        (err) => {
            if(err) res.status(500).send(err);
            else res.end();
        }
    );
});