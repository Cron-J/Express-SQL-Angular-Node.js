var express = require('express'),
    orm = require('orm'),
    fs = require('fs'),
    config = require('./config/config');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */


// connection to MySQL Database
orm.db = orm.connect(config.db, function(err, db) {
    if (err) {
        console.log("Something is wrong with the connection", err);
        return;
    }
});


// Bootstrap models
var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function(file) {
    if (file.indexOf('.js') >= 0) {
        require(modelsPath + '/' + file);
    }
})


var app = express();

// parse urlencoded request bodies into req.body
app.use(express.bodyParser())

app.use(express.static(__dirname + '/app/views'));

app.get('/', function(req, res) {
    res.render('index');
});

// Bootstrap routes
require('./config/routes')(app);


app.listen(config.port);
console.log('Express app started on port: ' + config.port);

// expose app
exports = module.exports = app;