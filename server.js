var http        = require('http'),
    express     = require('express'),
    util        = require('util'),
    hbs         = require('hbs'),
    io          = require('socket.io'),
    app         = express.createServer();

app.configure(function(){
  app.set("view engine", "hbs");
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/static'));
});  

app.get('/', function(req, res, next) {
  res.render("client", { locals: { } });
});

// call twilio, record message, in a websocket stream recorded audio and transcription

app.get('/twilio', function(req, res, next) {
    console.log(res.query);
    res.render("twilio", { locals: { } });
});

app.post('/twilio', function(req, res, next) {
    var recUrl = req.body.RecordingUrl;
    util.log("Recording URL=" + recUrl);
    return res.send("ok");
});

app.get('/twilio_transcribe', function(req, res, next) {
    res.render("twilio/transcribe", { locals: { } });    
    util.log(util.inspect(req));
});

app.listen(process.env.PORT || 8001);

var socket = io.listen(app); 
socket.on('connection', function(client){ 
    console.log("new socket connection!");
    broadcastStatus();
    client.on('message', function(){
        
    }); 
    client.on('disconnect', function(){
        broadcastStatus();
    }) 
});

function broadcastStatus() {
    // call on next tick because the client hasn't been removed from the list of
    // clients when we are processing a disconnect.
    process.nextTick(function() {
        var num_clients = Object.keys(socket.clients).length;
        var status = JSON.stringify( { type: "status", num_clients: num_clients});
        console.log("sending status " + util.inspect(status));
        socket.broadcast(status);            
    });
}

