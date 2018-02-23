// loading lodash
const _ = require('lodash');
// loading body-parser
const bodyParser = require('body-parser');
// loading async
const async = require('async');
// loading mongodb 
const db = require('mongodb').MongoClient;
const mongo = require('mongodb');  

// loading express
const express = require('express');
const server = express();

// dig JSON data from POST/DELETE bodies
server.use(bodyParser.json( {
	extended: true
}));

// announcing the stars
let database = "mydb";
let url = "mongodb://localhost:27017";

// handle API-calls  -------------------------------------------------------
const apiHandler = express.Router();

// check if still loading anything
apiHandler.use((req,res,next) => {
	next();
});

// let's handle queries
apiHandler.get('/', (req, res, next) => { 
        // make query to database and reply result                                                
        console.log("get all");                                                                   
        db.connect(url, (err, client) => {
                if(err) res.status(500).jsonp(err);
                const kanta = client.db(database);
                const dokki = kanta.collection('wizard');
                dokki.find({}).toArray((err, entries) => {
                        if(err) res.status(500).jsonp(err);
                        res.status(200).jsonp(entries);
                });
                client.close();
        });
});

apiHandler.get('/user/:uid', (req, res, next) => {
        // make query to database and reply result
        console.log("get byUserId " + req.params.uid);
        db.connect(url, (err, client) => {
                if(err) res.status(500).jsonp(err);
                const kanta = client.db(database);
                const dokki = kanta.collection('wizard');
                dokki.find({userId : req.params.uid}).toArray((err, entries) => {
                        if(err) res.status(500).jsonp(err);
                        res.status(200).jsonp(entries);
                });
                client.close();
        });
});

apiHandler.get('/session/:id', (req, res, next) => {
        // make query to database and reply result
        console.log("get bySessionId " + req.params.id);
        db.connect(url, (err, client) => {
                if(err) res.status(500).jsonp(err);
                const kanta = client.db(database);
                const dokki = kanta.collection('wizard');
                let oid = new mongo.ObjectId(req.params.id);
                dokki.find({_id : oid}).toArray((err, entries) => {
                        if(err) res.status(500).jsonp(err);
                        res.status(200).jsonp(entries);
                });
                client.close();
        });
});


// create new item!
apiHandler.post('/', (req, res, next) => {
        // work as logger, save all posts
        console.log('inserting data:');
        console.log(req.body);
        // insert document to database
        db.connect(url, (err, client) => {
                if(err) res.status(500).jsonp(err);
                const kanta = client.db(database);
                const dokki = kanta.collection('wizard');
                let id = {};

                id = dokki.insertOne(req.body, (err, entry, test) => {
                        if(err) res.status(500).jsonp(err);
                        client.close();
                        return res.status(200).jsonp({ id : entry.insertedId });
                });
        });
});

// atleast trying to respond politely
apiHandler.all('*', (req, res) => {
	console.log('un-assigned call');
	return res.status(500).jsonp({error: 'don\'t go there'});
});

server.use('/', apiHandler);

// start server  -----------------------------------------------------------
server.listen(8080);



