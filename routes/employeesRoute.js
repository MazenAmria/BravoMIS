const { Router } = require('express');
const db = require('../dbConnection');
const bcrypt = require('bcrypt');
const router = Router();
const { managerMenu, vendingManagerMenu, cashierMenu, guestMenu } = require('../assets/js/defaultMenues');
const {reqAuth} = require('../middlewares/authMiddleware');

router.get('/employees', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        let menu;
        let role = res.locals.role.toLowerCase();
        switch (true) {
            case /.*cashier.*/.test(role):
                menu = cashierMenu;
                break;
            case /.*vending manager.*/.test(role):
                menu = vendingManagerMenu;
                break;
            case /.*manager.*/.test(role):
                menu = managerMenu;
                break;
            default:
                menu = guestMenu;
        }
        if(role == 'manager'){
            db.query(`SELECT E.emp_id, E.emp_name, E.emp_role FROM employee E`, (err, results) => {
                if(err){
                    console.log(err);
                }else{
                    res.render('employees', {
                        title: 'الموظفين',
                        name: res.locals.name,
                        role: res.locals.role,
                        menu: menu,
                        location: 'employees',
                        employeesTableRows: results,
                        employeesTableFields: {
                            emp_id:'إسم المستخدم',
                            emp_name: 'إسم الموظف',
                            emp_role: 'الوظيفة'
                        }
                    });
                }
            });
        }else{
            res.status(404).send('Not Found');
        }
    }
});

router.get('/employees/edit', (req, res) => {
    console.log(req.query);
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        let menu;
        let role = res.locals.role.toLowerCase();
        switch (true) {
            case /.*cashier.*/.test(role):
                menu = cashierMenu;
                break;
            case /.*vending manager.*/.test(role):
                menu = vendingManagerMenu;
                break;
            case /.*manager.*/.test(role):
                menu = managerMenu;
                break;
            default:
                menu = guestMenu;
        }
        if(role == 'manager'){
            let employeesToEdit = Object.values(req.query);
            let usersArray = `('` + employeesToEdit.join(`','`) + `')`;
            console.log(usersArray);
            db.query(`SELECT E.emp_id, E.emp_name, E.emp_role FROM employee E WHERE E.emp_id IN ${usersArray}`, (err, results) => {
                if(err){
                    console.log(err);
                }else{
                    res.render('editEmployees', {
                        title: 'تعديل الموظفين',
                        name: res.locals.name,
                        role: res.locals.role,
                        menu: menu,
                        location: 'employees',
                        employees: results
                    });
                }
            });
        }else{
            res.status(404).send('Not Found');
        }
    }
});

router.post('/submit-employee', reqAuth, (req, res) => {
    const salt = bcrypt.genSaltSync();
    let employeeName = req.body.employeeName,
        employeeUsername = req.body.employeeUsername,
        employeePassword = bcrypt.hashSync(req.body.employeePassword, salt),
        employeeRole = req.body.employeeRole;

    db.query(`INSERT INTO employee VALUE('${employeeUsername}', '${employeePassword}', '${employeeName}', '${employeeRole}')`, (err, results) => {
        if(err){
            res.status(409).send('Duplicate');
        }else{
            res.status(200).send('Success');
        }

    });
});









module.exports = router;
