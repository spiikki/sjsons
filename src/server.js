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

// announcing the stars
let database = {};
let hardFilter = {};
let loadingDB = true;
let loadingHardFilter = true;

// handle API-calls  -------------------------------------------------------
const apiHandler = express.Router();

// check if still loading anything
apiHandler.use((req,res,next) => {
	next();
});

// let's handle queries 
apiHandler.get('/', (req, res, next) => {
	// make query to database and reply result
	let result = {};
	return res.jsonp(_.filter(result, req.query));
});

// create new item!
apiHandler.post('/', (req, res, next) => {
	// work as logger, save all posts
	console.log('inserting data:');
	console.log(req.body);
	// insert document to database

	//

	res.status(202).jsonp(req.body); // 202 Accepted 
	return true;
});

// delete item x(
apiHandler.delete('/', (req, res, next) => {
	if( !true ) { // document not found from database
		return res.status(404).jsonp({error: 'not in the library'});
	} else {
		console.log('deleting data: ');
		console.log(req.body);
		// delete document
		res.status(202).jsonp(req.body);
		return true;
	}
});

// atleast trying to respond politely
apiHandler.all('*', (req, res) => {
	console.log('un-assigned call');
	return res.status(500).jsonp({error: 'don\'t go there'});
});

server.use('/', apiHandler);

// start server  -----------------------------------------------------------
server.listen(8080);



