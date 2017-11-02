// loading lodash
var _ = require('lodash');
// laoding body-parser
var bodyParser = require('body-parser');

// loading express
var express = require('express');
var server = express();

// dig JSON data from POST/DELETE bodies
server.use(bodyParser.urlencoded( {
	extended: true
}));

// loading fileIO
var fs = require('fs');

// load database -----------------------------------------------------------
var database = {};
fs.readFile('/data/items.json', (err, data) => {
	if (err) console.log(err);
	database = JSON.parse(data);
});

// let's keep watcher for items, just for curiosity
fs.watchFile('/data/items.json', {interval: 500}, (curr, prev) => {
	console.log(`${curr.mtime} : items changed! (maybe)`);
});

// Load hardFilter ---------------------------------------------------------
var hardFilter = {};
fs.readFile('/data/hiddenItems.json', (err, data) => {
	if (err) console.log(err);
	hardFilter = JSON.parse(data);
});

// watch filter-file for changes and update it (500ms)
fs.watchFile('/data/hiddenItems.json', {interval: 500}, (curr, prev) => {
	console.log(`${curr.mtime} : hiddenItems changed! (maybe)`);
	fs.readFile('/data/hiddenItems.json', (err, data) => {
		if (err) console.log(err);
		hardFilter = JSON.parse(data);
	});
});

// handle API-calls  -------------------------------------------------------
var apiHandler = express.Router();

// let's handle queries
apiHandler.get('/', (req, res, next) => {
	var result = database;

	_.each(hardFilter, (value, key) => {
		result = _.reject(result, { type: value } );
	});

	res.jsonp(_.filter(result, req.query));
});

// create new item!
apiHandler.post('/', (req, res, next) => {
	// work as logger, save all posts
	console.log("inserting data:");
	console.log(req.body);
	database.push(req.body);
	res.status(202).jsonp(req.body); // 202 Accepted 

	//TODO: save it!!
});

// delete item x(
apiHandler.delete('/', (req, res, next) => {
	console.log("deleting data: ");
	console.log(req.body);

	if( _.find(database, req.body) == undefined) {
		res.status(404).jsonp({error: "not in the library"});
	} else {
		database.pop(req.body);
		res.status(202).jsonp(req.body);
	}
	//TODO: save it!!
});

// atleast trying to respond politely
apiHandler.all('*', (req, res) => {
	console.log('un-assigned call');
	res.status(500).jsonp({error: 'don\'t go there'});
});

server.use('/api', apiHandler);

// start server  -----------------------------------------------------------
server.listen(8080);



