const { Router } = require('express');
const db = require('../dbConnection');
const bcrypt = require('bcrypt');
const router = Router();
const {reqAuth} = require('../middlewares/authMiddleware');

// Route to render employees
router.get('/employees', (req, res) => {
    const role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            db.query(`SELECT DAY((SELECT min(E.emp_registration_date) FROM EMPLOYEE E)) AS minDay,
            MONTH((SELECT min(E.emp_registration_date) FROM EMPLOYEE E)) AS minMonth,
            YEAR((SELECT min(E.emp_registration_date) FROM EMPLOYEE E)) AS minYear,
            DAY((SELECT max(E.emp_registration_date) FROM EMPLOYEE E)) AS maxDay,
            MONTH((SELECT max(E.emp_registration_date) FROM EMPLOYEE E)) AS maxMonth,
            YEAR((SELECT max(E.emp_registration_date) FROM EMPLOYEE E)) AS maxYear`, (err, results) => {
                res.render('employees', {
                    employeesDates: results[0]
                });
            });

        }else{
            res.status(404).send('Not Found');
        }
    }
});

// Route to get employees table
router.get('/employees/api', (req, res) => {
    let role = res.locals.role.toLowerCase();
    if(res.statusCode === 440){
        res.redirect('/login');
    }else{
        if(role == 'manager'){
            const filter = req.query;
            let query = ``;
            if(Object.keys(filter).length == 0){
                query = `SELECT E.emp_id, E.emp_name, E.emp_role, DATE_FORMAT(E.emp_registration_date, '%Y-%m-%d') AS emp_registration_date, E.emp_status
                      FROM employee E`;
            }else{
                let employeeNameFilter = filter.employeeNameFilter,
                employeeUsernameFilter = filter.employeeUsernameFilter,
                employeeRole = filter.employeeRole,
                startDateD = filter.startDateD,
                startDateM = filter.startDateM,
                startDateY = filter.startDateY,
                endDateD = filter.endDateD,
                endDateM = filter.endDateM,
                endDateY = filter.endDateY,
                startDate = `${startDateY}-${startDateM}-${startDateD}`,
                endDaye = `${endDateY}-${endDateM}-${endDateD}`;
                query = `SELECT E.emp_id, E.emp_name, E.emp_role, DATE_FORMAT(E.emp_registration_date, '%Y-%m-%d') AS emp_registration_date, E.emp_status
                FROM employee E
                WHERE E.emp_id LIKE '%${employeeUsernameFilter}%' AND
                E.emp_name LIKE '%${employeeNameFilter}%' AND
                E.emp_role LIKE '%${employeeRole}%' AND
                E.emp_registration_date >= '${startDate}' AND
                E.emp_registration_date <= '${endDaye}'`;
            }
            db.query(query, (err, results) => {
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

// Route to get all employees requested to edit
router.get('/employees/edit', (req, res) => {
    let role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            let employeesToEdit = Object.values(req.query);
            let usersArray = `('` + employeesToEdit.join(`','`) + `')`;
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

// Add new employee route
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

// Submit edit employee route
router.post('/submit-edit-employees', reqAuth, (req, res) => {
    let role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            const employeesToEdit = req.body.employeesToEdit; 
            try{
                for(key in employeesToEdit){
                    const employeeName = employeesToEdit[key].employeeName,
                        employeeUsername = employeesToEdit[key].employeeUsername,
                        employeeStatus = employeesToEdit[key].employeeStatus;
                    db.query(`UPDATE employee E SET E.emp_name = '${employeeName}', E.emp_status = '${employeeStatus}' WHERE E.emp_id = '${employeeUsername}'`, (err) => {
                        if(err){
                            res.status(409).send("Failed");
                        }
                    });
                }
                res.status(200).send("Success");
            }catch(err){
                res.status(409).send("Failed");
            }
        }
    }
});

// Deleteing employees route
router.delete('/employees/delete', reqAuth, (req, res) => {
    let role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            const deleteEmployees = req.body.deleteEmployees;
            const deleteEmployeesSQLArray = `('` + deleteEmployees.join(`','`) + `')`;
            db.query(`DELETE FROM employee E WHERE E.emp_id IN ${deleteEmployeesSQLArray}`, (err) => {
                if(err){
                    console.log(err);
                    res.status(405).send('Failed');
                }else{
                    res.status(200).send('Success');
                }
            });
        }
    }
});



module.exports = router;
