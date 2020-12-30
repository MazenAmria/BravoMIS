const { Router } = require('express');
const db = require('../dbConnection');
const bcrypt = require('bcrypt');
const router = Router();
const {reqAuth} = require('../middlewares/authMiddleware');

router.get('/employees', (req, res) => {
    const role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            res.render('employees', {
                title: 'الموظفين',
                role: res.locals.role
            });
        }else{
            res.status(404).send('Not Found');
        }
    }
});
router.get('/employees/api', (req, res) => {
    let role = res.locals.role.toLowerCase();
    if(res.statusCode === 440){
        res.redirect('/login');
    }else{
        if(role == 'manager'){
            db.query(`SELECT E.emp_id, E.emp_name, E.emp_role, DATE_FORMAT(E.emp_registration_date, '%Y-%m-%d') AS emp_registration_date, E.emp_status
                      FROM employee E`, (err, results) => {
                if(err){
                    console.log(err);
                }else{
                    res.json(results);
                }
            });
        }else{
            res.status(404).send('Not Found');
        }
    }
});
router.get('/employees/edit', (req, res) => {
    let role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            let employeesToEdit = Object.values(req.query);
            let usersArray = `('` + employeesToEdit.join(`','`) + `')`;
            console.log(usersArray);
            db.query(`SELECT E.emp_id, E.emp_name, E.emp_role, E.emp_status FROM employee E WHERE E.emp_id IN ${usersArray}`, (err, results) => {
                if(err){
                    console.log(err);
                }else{
                    res.render('editEmployees', {
                        title: 'تعديل الموظفين',
                        role: res.locals.role,
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

    let role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            const salt = bcrypt.genSaltSync();
            let employeeName = req.body.employeeName,
                employeeUsername = req.body.employeeUsername,
                employeePassword = bcrypt.hashSync(req.body.employeePassword, salt),
                employeeRole = req.body.employeeRole,
                now = new Date(),
                currentDate = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

            db.query(`INSERT INTO employee VALUE('${employeeUsername}', '${employeePassword}', '${employeeName}', '${employeeRole}', 'يعمل', '${currentDate}')`, (err, results) => {
                if(err){
                    console.log(err);
                    res.status(409).send('Duplicate');
                }else{
                    res.status(200).send('Success');
                }
            });
        }
    }
});
router.post('/submit-edit-employees', reqAuth, (req, res) => {
    const employeesToEdit = req.body.employeesToEdit; 
    try{
        for(key in employeesToEdit){
            const employeeName = employeesToEdit[key].employeeName,
                  employeeUsername = employeesToEdit[key].employeeUsername,
                  employeeStatus = employeesToEdit[key].employeeStatus;
            db.query(`UPADTE employee E
                      SET E.emp_name = '${employeeName}',
                          E.emp_status = '${employeeStatus}'
                      WHERE E.emp_id = 'employeeUsername'`, (err) => {
            });
        }
        res.status(200).send("Success");
    }catch(err){
        console.log(err);
        res.status(409).send("Success");
    }
});








module.exports = router;
