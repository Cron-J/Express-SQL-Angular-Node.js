var views = require('../app/controllers/views');

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.render('index');
    });

    app.post('/getViews', views.getViews);

    app.post('/getTotalCount', views.getTotalCount);

    app.get('/getUsername', views.getUsername);
};