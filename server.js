var http        = require('http'),
    express     = require('express'),
    util        = require('util'),
    hbs         = require('hbs'),
    io          = require('socket.io'),
    app         = express.createServer();

// simple persistence for caller message
var caller_message = "Leave a message";
// replace with your phone number!
var inbound_phone_number = "303-555-1234"

//
// Configure express
//
app.configure(function(){
  app.set("view engine", "hbs");
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/static'));
});  

//
// Default handler, render client template
//
app.get('/', function(req, res, next) {
  res.render("client", { locals: { number: inbound_phone_number } });
});

//
// Incoming call from Twilio
//
app.get('/twilio', function(req, res, next) {

    var message = {
        type: "incoming",
        data: req.query
    };

    socket.broadcast(JSON.stringify(message));
    res.render("twilio", { locals: { caller_message: caller_message } });
});

//
// Recording posted
//
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

//
// Change the message that's spoken to callers
//
app.post('/change_message', function(req, res) {
   caller_message = req.body.message; 
   res.send(200);
});

app.listen(process.env.PORT || 8001);

//
// Socket.IO Listener
//
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

//
// Broadcast number of clients status to all connected clients
//
function broadcastStatus() {
    // call on next tick because the client hasn't been removed from the list of
    // clients when we are processing a disconnect.
    process.nextTick(function() {
        var num_clients = Object.keys(socket.clients).length;
        var status = JSON.stringify( { type: "status", num_clients: num_clients});
        socket.broadcast(status);            
    });
}

/* sample of what to expect from Twilio on an incoming call
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
