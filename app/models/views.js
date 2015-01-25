var db = require('orm').db;

var Views = db.define('views', {
    id: Number,
    username: String,
    count: String,
    date: Date

}, {
    id: "id"
});