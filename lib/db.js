var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'root',
	database:'watson'
	// host: "host9.hospedameusite.com.br",
	// user: "informa6_watson",
	// password: "1BmW@ts0n",
	// database: "informa6_watson"
});

connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Connected..!');
	}
});

module.exports = connection;