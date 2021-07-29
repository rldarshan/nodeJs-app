const http = require("http");
const hostname = 'localhost';
const port = 3000;

const express = require('express');

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// Create a new ObjectID
var objectId = new ObjectID();

// const assert = require('assert');
const bodyParser = require('body-parser');

var router = express.Router();
var app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


//Create HTTP server and listen on port 3000 for requests
// const server = http.createServer((req, res) => {

// GET ALL EmployeeS 
app.get('/', (req, res, next) => {
    mongoOperation(req, res, function (data) {
        res.send({
            status: 'Fetching all Employees',
            data: data
        });
    });
});

/*app.get('/', function(req, res, next) {
  Book.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  });
});*/

// GET SINGLE Employee BY ID 
app.get('/:id', function (req, res, next) {
    mongoOperation(req, res, function (data) {
        res.send(data);
    });
});

// SAVE Employee 
app.post('/', function (req, res, next) {
    mongoOperation(req, res, function (data) {
        res.send(data);
    });
});

// UPDATE Employee 
app.put('/:id', function (req, res, next) {
    mongoOperation(req, res, function (data) {
        res.send(data);
    });
});

// DELETE Employee 
app.delete('/', function (req, res, next) {
    mongoOperation(req, res, function (data) {
        if (data) {
            res.send(data);
        }
    });
});



function mongoOperation(req, res, callback) {

    //Set the response HTTP header with HTTP status and Content type
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    /////////////////////////////////////////////////

    // Connection URL
    const url = 'mongodb://localhost:27017';

    // Database Name
    const dbName = 'employee';

    const reqest = req;

    (async function () {
        const client = new MongoClient(url, { useUnifiedTopology: true });

        /*
        NOTE:
        >> mongo --version
        If you are using version >= 3.1.0 change you mongo connection file to ->
        
         MongoClient.connect("mongodb://localhost:27017/YourDB", {
           useNewUrlParser: true,
           useUnifiedTopology: true
         })
        */
        try {
            await client.connect();
            console.log("Connected correctly to server");

            const col = client.db(dbName).collection(dbName);

            docs = {};

            if (reqest.method == 'GET') {
                docs = await col.find({}).toArray();
                docs['status'] = 'Fetching Employee by ID';
            } else if (reqest.method == 'POST') {
                await col.insertOne(reqest.body.emp);
                docs['status'] = 'Employee Added successfully';
            } else if (reqest.method == 'PUT') {

            } else if (reqest.method == 'DELETE') {
                var id = reqest.query['_id'].length == 24 ? ObjectID.createFromHexString(reqest.query['_id']) : +reqest.query['_id']

                await col.deleteOne({ _id: id });
                docs['status'] = 'Employee Deleted successfully';
            }

            // Close connection
            client.close();

            callback(docs);

            /*const docs = await col.find({}).toArray(funtion(err, data) {
                // Close connection
                client.close();

                callback(err, docs);
            });*/

            // Insert a single document
            // let r = await db.collection('employee').insertOne({ a: 1 });
            // assert.equal(1, r.insertedCount);

            // Insert multiple documents
            // r = await db.collection('inserts').insertMany([{ a: 2 }, { a: 3 }]);
            // assert.equal(2, r.insertedCount);
        } catch (err) {
            console.log(err.stack);

            // Close connection
            client.close();

            docs['status'] = 'Something went wrong while deleting Employee';
            callback(docs);
        }
    })();
}

/*function mongoOperation(callback) {
        (async function() {
            try {
                // Use connect method to connect to the server
                MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, client) {
                    if (client) {
                        // assert.equal(null, err);
                        console.log("Connected successfully to server");

                        const emp = client.db(dbName).collection("employee");

                        // emp.insertOne(data);

                        const emp_data = await client.db(dbName).collection("employee").find({}).toArray();

                        callback(emp_data);

                        client.close();
                    } else {
                        console.log("Unable to connect to MongoDB");
                    }
                });
            } catch (err) {
                console.log(err.stack);
            }
        })();
    }*/

//listen for request on port 3000, and as a callback function have the port listened on logged
app.listen(port, () => console.log(`Server running at http://localhost:${port}`))

/*server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});*/