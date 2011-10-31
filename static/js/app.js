(function() {
    var socket = new io.Socket(); 

    socket.on('connect', function(){ 
        $("#connection_status .disconnected").hide();
        $("#connection_status .connected").show();
    });
 
    socket.on('message', function(data){ 
        var message = JSON.parse(data);

        if(message.type === "status") {
            setNumberOfClients(message.num_clients);
        }
        else if(message.type === "incoming") {
            incomingCall(message.data);
        }
        else if(message.type === "recording") {
            newRecording(message.data);
        }
    });

    socket.on('disconnect', function(){
        $("#connection_status .connected").hide();
        $("#connection_status .disconnected").show();
        setNumberOfClients();
        setTimeout(socket.connect, 600);
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
        $('.' + data.CallSid).append('<div><audio src="' + data.RecordingUrl + '" autoplay="true" controls preload="auto" autobuffer></audio></div>');
    }

    function setNumberOfClients(num) {
        $("#num_clients span").html(num ? num : "-");
    }
})();