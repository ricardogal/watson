let http = require('http');
let debug = require('debug')('nodestr:server');
let express = require('express');
const routers = require('./routes/rotas');
const ticketsRoute = require('./routes/tickets');
const cors = require('cors');

const port = 3000;

const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.set('port',port);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(cors());

const server = http.createServer(app);
//const router = express.Router();


app.use('/', routers);

module.exports = app;

server.listen(port);
