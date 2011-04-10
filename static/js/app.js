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
    
$("#change_message_container button").live('click', function() {
    var elem = $("#change_message");
    var newMessage = elem.val(); 
    $.ajax({ url: "/change_message", data: { message: newMessage }, type: "POST", success: function() { elem.val(""); }});
});

function incomingCall(data) {
    $('<div class="incoming ' + data.CallSid + '">incoming call<br/>from:<br/><br/>' + data.From + '<br/>' + data.FromCity + ', ' + data.FromState +'</div>').prependTo("#status_container");
}

function newRecording(data) {
    //http://api.twilio.com/2010-04-01/Accounts/AC8d378f413f9f2742932bc8642a0d5c02/Recordings/RE5d9cbb8101b8ac10ea6108ecb919c26e
    $('.' + data.CallSid).append('<div><audio src="' + data.RecordingUrl + '" autoplay="true" controls preload="auto" autobuffer></audio></div>');
}