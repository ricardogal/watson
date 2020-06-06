const express = require('express');
const routers = express.Router();
const crypto = require('crypto');
const dbConn  = require('../lib/db');
const user = require('../repository/user-repository');
const ticket = require('../repository/ticket-repository');
const watsonRepo = require('../repository/watson-repository');


// lista usuários
routers.get('/user', function(req, res, next) {
    user.list(res);
});

// get usuário
routers.get('/user/(:id)', function(req, res, next) {
    let id = req.params.id;
    user.get(id, res);
});

//Insere
routers.post('/user', function(req, res, next) {
    console.log("criar")
    user.create(req, res);
});

//Atualiza
routers.put('/user/(:id)', function(req, res, next) {
    let password = ""+req.body.password;
    let register = ""+req.body.register;
    let name     = ""+req.body.name;

    let form_data = {
        password: crypto.createHash('md5').update(password).digest("hex"),
        register: register,
        name: name,
        id: req.params.id
    }
    user.update(form_data, res);
});


//login
routers.post('/login', function(req, res, next) {
    let password = ""+req.body.password;
    let register = ""+req.body.register;
    let form_data = {
        password: crypto.createHash('md5').update(password).digest("hex"),
        register: register
    }

    user.login(form_data, res);
});

routers.delete('/user/(:id)', function(req, res, next) {
    user.delete(req,res);
});


/***Tickets***/
routers.get('/tickets', function(req, res, next) {
    ticket.list(res);
});

routers.get('/tickets/(:idUser)', function(req, res, next) {
    let idUser = req.params.idUser;
    ticket.listByUser(idUser, res);
});

routers.delete('/tickets/(:id)', function(req, res, next) {
    let id = req.params.id;
    ticket.list(id, res);
});

//*** WATSON *****//

routers.post('/watson', function(req, http_response, next) {
    watsonRepo.sendMessage(req, http_response);
});

module.exports = routers;
