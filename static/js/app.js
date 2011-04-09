// function($) {    
    var socket = new io.Socket(); 
    socket.on('connect', function(){ 
        console.log("connected!");
    });
     
    socket.on('message', function(data){ 
        var message = JSON.parse(data);
        console.log("new message!", message);
        if(message.type === "status") {
            $("#num_clients span").html(message.num_clients);
        }
        else if(message.type === "incoming") {
            console.log(message.data);
            incomingCall(message.data);
        }
        else if(message.type === "recording") {
            console.log(message.data);
            newRecording(message.data);
        }
    });
    
    socket.on('disconnect', function(){
        
    });
    
    socket.connect();
    
    setInterval(function() { incomingCall({ CllSid: "12345", From: "3035551212", FromCity: "Aurora", FromState: "CO"})}, 5000);
    
// }(jQuery);

function incomingCall(data) {
    $('<div class="incoming ' + data.CallSid + '">incoming call<br/>from:<br/><br/>' + data.From + '<br/>' + data.FromCity + ', ' + data.FromState +'</div>').prependTo("#status_container");
}

function newRecording(data) {
    $('.' + data.CallSid).append('<div><a href="' + data.RecordingUrl + '">Recording</a></div>');
}