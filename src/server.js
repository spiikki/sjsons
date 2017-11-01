// loading express
var express = require('express');
var server = express();

// loading fileIO
var fs = require('fs');

// load database
var database = {};
fs.readFile('/data/items.json', (err, data) => {
	if (err) throw err;
	database = JSON.parse(data);
});

// follow filter-list and load on change
var hardFilter = {};
fs.readFile('/data/hiddenItems.json', (err, data) => {
	if (err) throw err;
	hardFilter = JSON.parse(data);
});

fs.watchFile('/data/hiddenItems.json', {interval: 500}, (curr, prev) => {
	console.log(`${curr.mtime} : hiddenItems changed! (maybe)`);
	fs.readFile('/data/hiddenItems.json', (err, data) => {
		if (err) throw err;
		hardFilter = JSON.parse(data);
	});

});

// handle API-calls
var apiHandler = express.Router();
apiHandler.use((req, res, next) => {
	console.log('TODO: validate API-call');
	next();	
});

apiHandler.get('/', (req, res, next) => {
	console.log('api root called');
	res.jsonp({this : 'dog', hardFilter: hardFilter});

});

apiHandler.all('*', (req, res) => {
	console.log('un-assigned call');
	res.status(500).jsonp({error: 'don\'t go there'});
});

server.use('/api', apiHandler);

// start server
server.listen(8080);



