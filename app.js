const express = require('express');
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

const app = express();
require('dotenv').config();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var database, collection;
const port = process.env.PORT || 3000              

app.listen(port, () => {
    MongoClient.connect(process.env.CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(process.env.DB_NAME);
        collection = database.collection(process.env.COLLECTION);
        console.log("Connected to `" + process.env.DB_NAME + "`!");
    });
});

app.get("/map", (request, response) => {
    collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.get("/map/:id", (request, response) => {
    collection.findOne({ "_id": request.params.id }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.get('/', (req, res) => { 
    res.sendFile('index.html', {root: __dirname});                                                
});
