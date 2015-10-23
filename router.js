var querystring = require('querystring'); 
var fs = require('fs'); 
// var urlmod = require('url'); 
// var path = require('path'); 

var Profile = require("./profile.js"); 
var renderer = require("./renderer"); 

var commonHeaders = {'Content-Type': 'text/html'}; 
//Handle HTTP route GET / and POST / 
function home(request, response) {
	if (request.url === "/") {
		if (request.method.toLowerCase() === 'get') {
			response.writeHead(200, commonHeaders); 
			renderer.view("header", {}, response); 
			renderer.view("search", {}, response); 
			renderer.view("footer", {}, response); 
			response.end("\n"); 
		} else {
			// if url == "/" && POST
				//get the post data from body and extract username
				request.on('data', function(postBody) {
					var query = querystring.parse(postBody.toString()); 
					//redirect to /:username as url. Ok as we are on the same domain
					response.writeHead(303, {'Location': '/' + query.username}); 
					response.end("\n"); 
				})
			}
	}
}

//Handle HTTP route GET /:username i.e. /chalkers
function user(request, response) {
	// if url == "/...."
	var username = request.url.replace("/", ""); 
	if (username.indexOf('.') === -1) {
		if (username.length > 0) {
			response.writeHead(200, commonHeaders); 		
			renderer.view("header", {}, response); 
			//get json from Treehouse
			var studentProfile = new Profile(username);
			//on "end"
			studentProfile.on("end", function(profileJSON) {
				// show profile		
				var values = {
					avatarURL: profileJSON.gravatar_url, 
					userName: profileJSON.profile_name, 
					badgeCount: profileJSON.badges.length, 
					javascriptPoints: profileJSON.points.JavaScript
				};	
				//Simple Response
				renderer.view('profile', values, response); 
				renderer.view('footer', {}, response); 
				response.end('\n'); 
			}); 
			//on "error" 
			studentProfile.on("error", function(error){ 
				// show error
				renderer.view('error', {errorMessage: error.message}, response); 
				renderer.view("search", {}, response); 				
				renderer.view('footer', {}, response); 
				response.end('\n'); 
			}); 
		}
	}
}

//Handle HTTP route GET /views/css/main.css
//Can expand to handle serving different static file types
function staticFile(request, response) {
	var path = request.url.slice(1); //remove leading '/'
	var commonHeaders = {'Content-Type': 'text/css'};
	if (path.indexOf('.css') != -1) {  //does the path include a .css extension? 

		//read target file and write to response
		//I created a read stream. probably overkill. could have done a readFileSync() 
		//or even a .readFile()
		var cssFileStream = fs.createReadStream(path, {encoding: 'utf8'});   
		cssFileStream.on('open', function() {
			console.log("Readable stream opened at client-requested path: " + path); 
			response.writeHead(200, commonHeaders);
		})
		cssFileStream.on('error', function(error) {
			response.writeHead(404, {'Content-Type': 'text/plain'});
			response.write("404 Not Found\n"); 
			console.log("There was an error with the path: " + error.message); 
			response.end('\n');
		});
		cssFileStream.pipe(response); 

		// cssFileStream.on('readable', function() {
		// 	var chunk; 
		// 	while (null !== (chunk = cssFileStream.read())) {
		// 		response.write(chunk.toString()); 
		// 	}
		// })
		// cssFileStream.on('data', function(chunk) {
		// 	console.log('emitted data'); 
		// 	response.write(chunk); 
		// }); 
		// cssFileStream.on('end', function() {
		// 	console.log('ended read stream'); 
		// 	response.end('\n'); 
		// });
	}
}

module.exports.home = home; 
module.exports.user = user; 
module.exports.staticFile = staticFile; 