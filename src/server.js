// loading lodash
const _ = require('lodash');
// loading body-parser
const bodyParser = require('body-parser');
// loading async
const async = require('async');

// loading express
const express = require('express');
const server = express();

// dig JSON data from POST/DELETE bodies
server.use(bodyParser.urlencoded( {
	extended: true
}));

// loading fileIO
const fs = require('fs');

// announcing the stars
let database = {};
let hardFilter = {};
let loadingDB = true;
let loadingHardFilter = true;
const DBSOURCE = '/data/items.json';
const HARDFILTERSOURCE = '/data/hiddenItems.json';

// helper functions --------------------------------------------------------
function saveDB() {
	fs.writeFileSync(DBSOURCE, JSON.stringify(database));
};
function loadDB() {
	loadingDB = true;
	fs.readFile(DBSOURCE, (err, data) => {
		if (err) console.log(err);
		try {
			database = JSON.parse(data);
			console.log('database loaded')
		} catch (e) {
			console.log(e);
		}
		loadingDB = false;
		return database;
	});	
};
function loadHardFilter() {
	loadingHardFilter = true;
	fs.readFile(HARDFILTERSOURCE, (err, data) => {
		if (err) console.log(err);
		try {
			hardFilter = JSON.parse(data);
			console.log('hardFilter loaded')
		} catch (e) {
			console.log(e);
		}
		loadingHardFilter = false;
		return hardFilter;
	});	
};

// load data ---------------------------------------------------------------
async.parallel([
	function(callback) {
		database = loadDB();
		callback(null);
	},
	function(callback) {
		hardFilter = loadHardFilter();
		callback(null);
	}
]);

// let's keep watch for items
fs.watchFile(DBSOURCE, {interval: 100}, (curr, prev) => {
	// filesystem echoes when saving, only read when theres significant delay
	if((curr.mtimeMs - prev.mtimeMs) < 100.0 ) {
		console.log('loading db');
		database = loadDB();
	}
});

// watch filter-file for changes and update it (500ms)
fs.watchFile(HARDFILTERSOURCE, {interval: 100}, (curr, prev) => {
	hardFilter = loadHardFilter();
});

// handle API-calls  -------------------------------------------------------
const apiHandler = express.Router();

// check if still loading data-files
apiHandler.use((req,res,next) => {
	if(loadingDB) return res.status(503).jsonp({status:'loading data file'});
	if(loadingHardFilter) return res.status(503).jsonp({status:'loading filter file'});
	next();
});

// let's handle queries 
apiHandler.get('/', (req, res, next) => {
	let result = database;

	_.each(hardFilter, (value, key) => {
		result = _.reject(result, { type: value } );
	});

	return res.jsonp(_.filter(result, req.query));
});

// create new item!
apiHandler.post('/', (req, res, next) => {
	// work as logger, save all posts
	console.log('inserting data:');
	console.log(req.body);
	database.push(req.body);
	res.status(202).jsonp(req.body); // 202 Accepted 
	saveDB();
	return true;
});

// delete item x(
apiHandler.delete('/', (req, res, next) => {
	if( _.find(database, req.body) == undefined) {
		return res.status(404).jsonp({error: 'not in the library'});
	} else {
		console.log('deleting data: ');
		console.log(req.body);
		database.pop(req.body);
		res.status(202).jsonp(req.body);
		saveDB();
		return true;
	}
});

// atleast trying to respond politely
apiHandler.all('*', (req, res) => {
	console.log('un-assigned call');
	return res.status(500).jsonp({error: 'don\'t go there'});
});

server.use('/api', apiHandler);

// start server  -----------------------------------------------------------
server.listen(8080);



