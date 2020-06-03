'use strict';
const express = require('express');
const ticketsRoute = express.Router();
const dbConn  = require('../lib/db');

// lista tickets
ticketsRoute.get('/tickets', function(req, res, next) {
    res.status(200).send({
        data: 'resultado',
    });
});

module.exports = ticketsRoute;