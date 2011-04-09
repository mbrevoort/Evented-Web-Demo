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

    var message = {
        type: "incoming",
        data: req.query
    };

    socket.broadcast(JSON.stringify(message));
    res.render("twilio", { locals: { } });
});

app.post('/twilio', function(req, res, next) {
    var recUrl = req.body.RecordingUrl;
    util.log("Recording URL=" + recUrl);

    var message = {
        type: "recording",
        data: req.body
    };
        
    socket.broadcast(JSON.stringify(message));
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

/*
{ AccountSid: 'AC8d378f413f9f2742932bc8642a0d5c02',
  ToZip: '80640',
  FromState: 'CO',
  Called: '+13033515939',
  FromCountry: 'US',
  CallerCountry: 'US',
  CalledZip: '80640',
  Direction: 'inbound',
  FromCity: 'AURORA',
  CalledCountry: 'US',
  CallerState: 'CO',
  CallSid: 'CA633b577f4fd02e215baf8f9682322ad6',
  CalledState: 'CO',
  From: '+13038342509',
  CallerZip: '80012',
  FromZip: '80012',
  CallStatus: 'ringing',
  ToCity: 'HENDERSON',
  ToState: 'CO',
  To: '+13033515939',
  ToCountry: 'US',
  CallerCity: 'AURORA',
  ApiVersion: '2010-04-01',
  Caller: '+13038342509',
  CalledCity: 'HENDERSON' }
*/
