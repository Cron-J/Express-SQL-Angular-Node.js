var db = require('orm').db,
    Views = db.models.views,
    request = require('request'),
    async = require('async'),
    config = require('../../config/config'),
    username = require('../../config/username').username,
    google = require('googleapis'),
    youtube = google.youtube('v3'),
    CronJob = require('cron').CronJob;

var job = new CronJob({
    cronTime: config.cronTime,
    onTick: function() {
        var list = [];
        async.each(username, function(file, callback) {
            youtube.channels.list({
                auth: config.apiKey,
                part: 'statistics',
                forUsername: file
            }, function(err, user) {
                var query = {};
                query['username'] = file;
                query['count'] = user.items[0].statistics.viewCount;
                query['date'] = new Date();
                list.push(query);
                callback();
            });

        }, function(err) {
            if (err) {
                console.log(err);
            } else {
                Views.create(list, function(err, result) {
                    if (err) {
                        throw new Error(err);
                        return;
                    }
                    console.log("Sucessfull");
                });
            }
        });

    },
    start: false,
    timeZone: config.timeZone
});
job.start();



exports.getViews = function(req, res, next) {
    var request = req.body;
    if (typeof(request) !== 'object' || req.get('Content-Type') != "application/json;charset=UTF-8") {
        var err = new Object();
        err.code = 400;
        err.message = 'Invalid request object';
        console.log(err);
        return next(err);
    } else {
        var count;
        Views.find({
            date: req.body.date,
            username: req.body.username
        }, function(err, views) {
            if (err) {
                throw new Error(err);
                return;
            }
            if (views[0] === undefined)
                res.end("No current date found");
            else count = views[0].count;

            var exploded = req.body.date.split('-');
            var prev = exploded[0] + "-" + exploded[1] + "-" + (exploded[2] - 1);

            Views.find({
                date: prev,
                username: req.body.username
            }, function(err, views) {
                if (err) {
                    throw new Error(err);
                    return;
                }

                if (views[0] === undefined)
                    res.end("No previous date found");
                else
                    count = count - views[0].count;
                res.end(JSON.stringify(count));
            });
        });
    }
}

exports.getUsername = function(req, res) {
    res.end(JSON.stringify(username));
}

exports.getTotalCount = function(req, res, next) {
    var request = req.body;
    if (typeof(request) !== 'object' || req.get('Content-Type') != "application/json;charset=UTF-8") {
        var err = new Object();
        err.code = 400;
        err.message = 'Invalid request object';
        console.log(err);
        return next(err);
    } else {

        youtube.channels.list({
            auth: config.apiKey,
            part: 'statistics',
            forUsername: req.body.username
        }, function(err, user) {
            if (user.items.length === 0) return res.end(JSON.stringify("No Result Found"));
            res.end(JSON.stringify(parseInt(user.items[0].statistics.viewCount)));
        });
    }
};