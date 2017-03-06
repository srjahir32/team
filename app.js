var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var busboy = require('connect-busboy');
var router = express.Router();
var apiRoutes = express.Router();
var jwt = require("jsonwebtoken");
var fs = require("fs");
var winston = require('winston');
var chalk = require('chalk');
var apiurl = express.Router();
var multipart = require('connect-multiparty');
var multer = require('multer');
var users = require(__dirname + ('/api/users.js'));

app.set('port', process.env.PORT || 8000);


app.locals.stripePublishableKey = process.env.pk_test_aUS7zJ7MxEOwoIqzJ9LDzbBJ;

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production'
}



app.use(bodyParser.urlencoded({
    limit: '500mb',
    extended: true,
    parameterLimit: 50000
}));
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,token');
    //res.setHeader('*');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(expressValidator());
app.use(bodyParser.json());
app.use(busboy());
app.use(express.static(__dirname + '/public'));

apiurl.use(function(req, res, next) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    exports.url = fullUrl;
    next();
});
app.use('/', apiurl);

var fs = require('fs');


apiRoutes.use(function(req, res, next) {

    var token = req.body.token || req.query.token || req.headers['token'];

    if (token) {
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.json({ "code": 200, "status": "Error", "message": "Failed to authenticate token" });
            } else {

                req.user = decoded;
                next();
            }
        });
    } else {
        return res.json({ "code": 200, "status": "Error", "message": "No token provided" });
    }
});

app.use('/api', apiRoutes);
app.use('/staging/api', apiRoutes);

app.get('/', function(req, res) {
    res.sendFile("login.html", { "root": 'views' });
});
app.get('/home', function(req, res) {
    res.sendFile("home.html", { "root": 'views' });
});

app.post('/user/signup', users.signup);
app.post('/user/signin', users.signin);

app.use("/css", express.static(__dirname + '/public/css'));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/img", express.static(__dirname + '/public/images'));
app.use("/scripts", express.static(__dirname + '/public/scripts'));
app.use("/nodemodules", express.static(__dirname + '/node_modules'));
app.use("/views", express.static(__dirname + '/views'));



app.listen(app.get('port'));
console.log("VaboApi Started on Port No. ", app.get('port'));