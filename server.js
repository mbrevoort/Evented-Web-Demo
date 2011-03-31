var http      = require('http'),
    express   = require('express'),
    hbs         = require('hbs'),
    app       = express.createServer();

app.configure(function(){
  app.set("view engine", "hbs");
  app.set('views', __dirname + '/views');
  app.use(express.static(__dirname + '/static'));
});  

app.get('/', function(req, res, next) {
  res.end("hmmmm what to do with this...\n");
});

app.listen(process.env.PORT || 8001);
