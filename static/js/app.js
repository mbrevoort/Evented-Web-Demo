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
    });
    
    socket.on('disconnect', function(){
        
    });
    
    socket.connect();
// }(jQuery);
