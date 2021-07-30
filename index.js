const cors = require("cors");
const hostname = 'localhost';
const port = 4000;

const express = require('express');
// const mongoose = require('mongoose');
// mongoose.connect("mongodb+srv://admin:admin123@cluster0.sgmlk.mongodb.net/myDB?retryWrites=true&w=majority").then(() => { console.log("Connection successful...!"); }).catch(() => { console.log("Connection failed...!"); });

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;

console.log("\n\n ============ Available MongoDB methods: =========  \n\n", require('mongodb'));

// Create a new ObjectID
var objectId = new ObjectID();
console.log("\n\n ======== ObjectId ========== \n\n", objectId);

// const assert = require('assert');
const bodyParser = require('body-parser');

var router = express.Router();
var app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());
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

    const url = 'mongodb+srv://admin:admin123@cluster0.sgmlk.mongodb.net/myDB?retryWrites=true&w=majority';
    // 'mongodb://localhost:27017';

    const dbName = 'myDB';
    const collectionName = 'myCollection';
    const reqest = req;

    (async function () {
        const client = new MongoClient(url, { useUnifiedTopology: true });

        /*
        NOTE:
        If you are using MongoDB version >= 3.1.0, then change your mongo connection file to ->
        
         MongoClient.connect("mongodb://localhost:27017/YourDB", {
           useNewUrlParser: true,
           useUnifiedTopology: true
         })
        */

        try {
            await client.connect();
            console.log("\n\n Connected correctly to server \n\n");

            const col = client.db(dbName).collection(collectionName);

            let docs = {};

            if (reqest.method == 'GET') {
                docs = await col.find({}).toArray();
                docs['status'] = 'Fetching All data';
                console.log(docs['status']);
            } else if (reqest.method == 'POST') {
                if (reqest.body.data) {
                    await col.insertOne(reqest.body.data);
                    docs['status'] = 'Data Added successfully';
                    console.log(docs['status']);
                } else {
                    docs['code'] = 400;
                    docs['status'] = "Required parameter not sent";
                }
            } else if (reqest.method == 'PUT') {
                if (reqest.body._id && reqest['body']['field'] && reqest['body']['fieldValue']) {
                    let field = reqest['body']['field'];
                    let fieldValue = reqest['body']['fieldValue'];

                    // First check whether the fields to be updated exists Or not


                    await col.updateMany({ _id: reqest.body._id }, { $set: { field: fieldValue } });
                    docs['status'] = 'Data updated successfully';
                } else {
                    docs['code'] = 400;
                    docs['status'] = "Required parameter not sent";
                }
            } else if (reqest.method == 'DELETE') {
                if (reqest.query._id) {
                    // let originalHex = objectId.toHexString(reqest.query['_id']);
                    let id = reqest.query['_id'].length == 24 ? new ObjectID(reqest.query['_id']) : +reqest.query['_id'];

                    await col.deleteOne({ _id: id });
                    docs['status'] = 'Data with specified ID Deleted successfully';
                    console.log(docs['status']);
                } else {
                    docs['code'] = 400;
                    docs['status'] = "Required parameter not sent";
                }
            }

            client.close(); // Close connection

            callback(docs);
        } catch (err) {
            console.log(err.stack);

            // Close connection
            client.close();

            docs['code'] = 500;
            docs['status'] = 'Something went wrong';
            callback(docs);
        }
    })();
}

//listen for request on port 3000, and as a callback function have the port listened on logged
app.listen(port, () => console.log(`\n\n Server running at http://localhost:${port} \n\n`))

/*server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});*/