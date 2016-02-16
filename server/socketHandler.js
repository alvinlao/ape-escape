var attachIO = function(io){
	console.log("IO attached.");
	io.on("connection", function(socket){
		console.log("User connected");
	});
}

exports.attachIO = attachIO;