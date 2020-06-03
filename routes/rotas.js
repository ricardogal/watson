const express = require('express');
const routers = express.Router();
const dbConn  = require('../lib/db');
const crypto = require('crypto');
const watson = require('../lib/watson');
var assistant_id = '7b514536-ce08-4103-8c72-f30feca0086c';


// lista usuários
routers.get('/users', function(req, res, next) {
    dbConn.query('select * from users', (err, rows) => {
        if (err){
            res.status(500).send({
                message: err,
            });
        }

        res.status(200).send({
            data: rows,
        });
    });
});

//login
routers.post('/login', function(req, res, next) {
    let password = ""+req.body.password;
    let register = ""+req.body.register;

    let form_data = {
        password: crypto.createHash('md5').update(password).digest("hex"),
        register: register
    }
console.log('select * from users where register = "'+form_data.register+'" and password = "'+form_data.password+'"');
    dbConn.query('select * from users where register = "'+form_data.register+'" and password = "'+form_data.password+'"', (err, rows) => {
        if (err){
            res.status(500).send({
                message: err,
            });
        }

        res.status(200).send({
            sucess: (rows).length == 1 ? true : false,
            data: rows
        });
    });
});
//lista tickets
routers.get('/tickets', function(req, res, next) {
    dbConn.query('select * from tickets', (err, rows) => {
        if (err){
            res.status(500).send({
                message: err,
            });
        }

        res.status(200).send({
            data: rows,
        });
    });
});

// display lit user's tickets
routers.get('/tickets/(:idUser)', function(req, res, next) {

    let idUser = req.params.idUser;

    dbConn.query('SELECT * FROM tickets WHERE idUser = ' + idUser, function(err, rows, fields) {
        if (err){
            res.status(500).send({
                message: err,
            });
        }

        res.status(200).send({
            sucess: rows,
        });
    })
})

routers.post('/tickets', function(req, res, next) {
    let title = req.body.title;
    let description = req.body.description;
    let status = req.body.status;
    let idUser = req.body.idUser;
    var form_data = {
        title: title,
        description: description,
        status: status,
        idUser:idUser
    }

    dbConn.query('INSERT INTO tickets SET ?', form_data, function(err, result) {
        //if(err) throw err
        if (err) {
            res.status(500).send({
                message: err,
            });
        } else {
            res.status(201).send({
                success: true,
                message: 'Ticket criado com sucesso!',
            });
        }
    })

});

routers.post('/users', function(req, res, next) {

    let name = req.body.name;
    let password = req.body.password;
    let register = req.body.register;
    let errors = false;

    // res.status(201).send({
    //     success: 'sucesso',
    //     message: 'Usuário criado com sucesso!',
    // });
    if(name.length === 0 || register.length === 0) {
        errors = true;
    }

    // if no error
    if(!errors) {

        var form_data = {
            name: name,
            password: crypto.createHash('md5').update(password).digest("hex"),
            register: register
        }

        // insert query
        dbConn.query('INSERT INTO users SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                res.status(500).send({
                    message: err,
                });
            } else {
                res.status(201).send({
                    success: true,
                    message: 'Usuário criado com sucesso!',
                });
            }
        });
    }
})

// display edit book page
routers.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('SELECT * FROM users WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err

        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Book not found with id = ' + id)
            res.redirect('/users')
        }
        // if book found
        else {
            //if(err) throw err
            if (err) {
                res.status(500).send({
                    message: err,
                });
            } else {
                res.status(200).send({
                    success: true,
                    message: 'Usuário criado com sucesso!',
                });
            }
        }
    })
})

// update book data
routers.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let name = req.body.name;
    let author = req.body.author;
    let errors = false;

    if(name.length === 0 || author.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and author");
        // render to add.ejs with flash message
        res.render('users/edit', {
            id: req.params.id,
            name: name,
            author: author
        })
    }

    // if no error
    if( !errors ) {

        var form_data = {
            name: name,
            author: author
        }
        // update query
        dbConn.query('UPDATE users SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('users/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    author: form_data.author
                })
            } else {
                req.flash('success', 'Book successfully updated');
                res.redirect('/users');
            }
        })
    }
})

// delete book
routers.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('DELETE FROM users WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to users page
            res.redirect('/users')
        } else {
            // set flash message
            req.flash('success', 'Book successfully deleted! ID = ' + id)
            // redirect to users page
            res.redirect('/users')
        }
    })
});


routers.post('/watson', function(req, res, next) {
    var message = req.body.message;
    var resp = res
    watson.createSession({ assistantId: '7b514536-ce08-4103-8c72-f30feca0086c'})
        .then((res) => {
            console.log(message);
            watson.message({
                assistantId: assistant_id,
                sessionId: res.result.session_id,
                input: {
                'message_type': 'text',
                'text': message
                }
            }).then(response => {
                resp.status(200).send({
                    data: response.result,
                });
            }).catch(err => {
                console.log(err);
            });
        }
    ).catch(err => {
        console.log(err);
    });
});



module.exports = routers;
