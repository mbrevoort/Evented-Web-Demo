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

// call twilio, record message, in a websocket stream recorded audio and transcription

app.get('/twilio', function(res, res, next) {
    res.render("twilio", { locals: { } });
});

app.get('/twilio_transcribe', function(res, res, next) {
    res.render("twilio/transcribe", { locals: { } });    
});

app.listen(process.env.PORT || 8001);

