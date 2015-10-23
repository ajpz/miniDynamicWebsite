var fs = require('fs'); 

function mergeValues(values, content) {
	//Cycle over keys
		//Replace all {{key}} with the value from the values object
	for (var key in values) {
		if (values.hasOwnProperty(key)) {
			content = content.replace("{{" + key + "}}", values[key]); 
		}
	}
	return content; 
}

function view(templateName, values, response) {
	//Read from the template file
	//Need to do this synchronously/blocking to ensure that the
	//response Stream is still open once we've loaded the file
	//Async load will take too long, and the main router function
	//will have finished, and already called response.end(). 
	var fileContents = fs.readFileSync('./views/' + templateName + '.html', {encoding: 'utf8'}); 
	//Insert values in to the content
	fileContents = mergeValues(values, fileContents); 
	//Write out to the response
	response.write(fileContents); 
};

module.exports.view = view; 