var debug = require('debug')('angularjs-sample');
var app = require('./init');

app.set('port', process.env.PORT || 1337);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});