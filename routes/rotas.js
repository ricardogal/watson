const express = require('express');
const routers = express.Router();
const crypto = require('crypto');
const dbConn  = require('../lib/db');
const watson = require('../lib/watson');
const user = require('../repository/user-repository');
const ticket = require('../repository/ticket-repository');
var assistant_id = '7b514536-ce08-4103-8c72-f30feca0086c';


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
    var message = req.body.message;
    var idUser = req.body.idUser;
    var resp = http_response
    if(req.body.session_id){
        session_id = req.body.session_id;
        enviaMensagem(message, session_id, http_response, idUser);
    }else{
        session_id = null;
        watson.createSession({ assistantId: '7b514536-ce08-4103-8c72-f30feca0086c'})
            .then((res) => {
                session_id = res.result.session_id;
                enviaMensagem(message, session_id, http_response, idUser);
            }
        ).catch(err => {
            console.log(err);
        });
    }

    function enviaMensagem(message, session_id, http_response, idUser){
        console.log(session_id);
        watson.message({
            assistantId: assistant_id,
            sessionId: session_id,
            input: {
                'message_type': 'text',
                'text': message
            }
        }).then(response => {
            let toProcess ={
                'responseWatson': response.result,
                'http_response': http_response,
                'session_id': session_id,
                'idUser': idUser,
                'message': message
            }
            processResponse(toProcess);
        }).catch(err => {
            console.log(err);
        });
    }

    function processResponse(toProcess){
        if(toProcess.responseWatson.output.intents.length > 0){
            if(toProcess.responseWatson.output.intents[0].intent == 'ListarTickets'){
                return ticket.listByUser(toProcess.idUser, toProcess.http_response, toProcess);
            }
        }
        if(toProcess.responseWatson.output.generic[0].text == "Muito obrigado, o ticket será aberto"){
            console.log(toProcess.responseWatson.output.generic[0].text);
            return ticket.create(toProcess);
        }

        http_response.status(200).send({
            success: true,
            result: toProcess.responseWatson,
            data: [],
            session_id: toProcess.session_id,
            idUser: toProcess.idUser
        });
    }
});

module.exports = routers;
