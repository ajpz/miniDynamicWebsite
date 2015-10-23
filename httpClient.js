//Use this GET request to be able to view the headers that I am writing 
//back to the client when the server is serving static files
//Can't see the headers or status codes when running requests via
//curl or browser web calls


var http = require('http'); 


http.get('http://127.0.0.1:1337/views/css/main.css', function(response) {
	var body = ""; 

	console.log('status: ' + response.statusCode);
	console.log('content-type: ' + response.headers['Content-Type'.toLowerCase()]); 

	response.on('data', function(chunk) {
		body += chunk.toString(); 
	})

	response.on('end', function() {
		console.log('end of transmission from server'); 
		console.log(body); 

	})
}).on('error', function(error) {
		console.error("Error occured: " + error.message +" and error raw: ", error); 
	})