// loading express
var express = require('express');
var server = express();

// load database

// handle API-calls
var apiHandler = express.Router();
apiHandler.use(function(req, res, next) {
	console.log('TODO: validate API-call');
	next();	
});

apiHandler.get('/', function(req, res, next) {
	console.log('api root called');
	res.jsonp({this : 'dog'});
});

apiHandler.all('*', function(req, res) {
	console.log('un-assigned call');
	res.status(500).jsonp({error: 'don\'t go there'});
});

server.use('/api', apiHandler);

// start server
server.listen(8080);