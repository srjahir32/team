var bcrypt = require('bcrypt-nodejs'); //For encryption
var jwt = require("jsonwebtoken");
var fs = require("fs");
var busboy = require('connect-busboy');
var express = require('express')
var multer = require('multer');
var upload = multer({
    dest: 'uploads/'
})
var app = express();
var path = require('path');
var fs = require('fs');
var validator = require('validator');
var date = require('date-and-time');
var MongoClient = require('mongodb').MongoClient;
var data = "mongodb://localhost:27017/data";
/*
 */
/*collection.find().toArray(function(err, items) {
            if (!err) {
                console.log('all data', items);
            } else {
                console.log('err', err);
            }
        });
        */

exports.signup = function(req, res) {
    console.log("*** Requested for Creating New User... ***");
    var email = req.body.email;
    var password = req.body.password;
    MongoClient.connect(data, function(err, db) {
        if (!err) {
            console.log("We are connected");
            var collection = db.collection('user');

            var lotsOfDocs = [{ 'email': email }, { 'password': password }];
            collection.insert(lotsOfDocs, { w: 1 }, function(err, result) {
                if (!err) {
                    console.log('data insereted Successfully...', result);
                    res.json({ 'message': 'User Created Successfully...', 'data': result });
                    return;
                } else {
                    console.log('Error', err);
                    res.json({ 'message': 'User Creating Error' });
                    return;
                }
            });
        } else {
            console.log('connection Error', err);
        }
    });


};

exports.signin = function(req, res) {
    console.log("*** Requested for Authenticating User... ***");

    MongoClient.connect(data, function(err, db) {
        if (!err) {
            console.log("We are connected");
            var collection = db.collection('user');

            var email = req.body.email;
            collection.find({ 'email': email }).toArray(
                function(err, item) {
                    if (!err) {
                        console.log('find data', item);
                        res.json({ 'code': 200, 'status': 'success', 'message': 'Successfully logged in', 'data': item });
                        return;
                    } else {
                        console.log('err', err);
                        res.json({ 'code': 200, 'status': 'error', 'message': 'login fail' });
                        return;
                    }
                });
        } else {
            console.log('connection Error', err);

        }
    });

}