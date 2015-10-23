var http = require('http'); 
var router = require('./router'); 
//Problem: We need a simple way to look at a user's badge count and javascript points from a web browser
//Solution: Use node.js to perform the profile lookups and serve our templates via http

//Create a web server
http.createServer(function(request, response) {
	router.staticFile(request, response);  
	router.home(request, response); 
	router.user(request, response);
}).listen(1337, '127.0.0.1'); 
console.log('Server running at http://127.0.0.1:1337/'); 


//Function that handles the reading of files and merge in value
	//read from file and get a string
	//merge values in to string
