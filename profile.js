var EventEmitter = require("events").EventEmitter;
// Q: why the EventEmitter property of events? 
// All objects that emit events are instances of events.EventEmitter
var https = require("https");
var http = require('http'); 
var util = require("util");  // Allows a Constructor to inherit from a SuperConstructor
//Inherit the prototype methods from one constructor into another. The prototype of
//constructor will be set to a new object created from superConstructor.
//As an additional convenience, superConstructor will be accessible through the 
//constructor.super_ property. 
//Basically... constructor.prototype = new SuperConstructor();  

/**
 * An EventEmitter to get a Treehouse students profile.
 * @param username
 * @constructor
 */
function Profile(username) {

    EventEmitter.call(this); //Add properties from 'EventEmitter' as part of Profile Constructor

    profileEmitter = this; //Create new variable reference to Profile instances (this)
    // Q: Why is this global (not prefaced by var)

    //Connect to the API URL (http://teamtreehouse.com/username.json)
    var request = https.get("https://teamtreehouse.com/" + username + ".json", function(response) {
        var body = "";

        if (response.statusCode !== 200) {
            request.abort();
            //Status Code Error
            profileEmitter.emit("error", new Error("There was an error getting the profile for " + username + ". (" + http.STATUS_CODES[response.statusCode] + ")"));
        }

        //Read the data
        response.on('data', function (chunk) {
            body += chunk;
            profileEmitter.emit("data", chunk);
        });

        response.on('end', function () {
            if(response.statusCode === 200) {
                try {
                    //Parse the data
                    var profile = JSON.parse(body);
                    profileEmitter.emit('end', profile); 
                } catch (error) {
                    profileEmitter.emit("error", error);
                }
            }
        }).on("error", function(error){
            profileEmitter.emit("error", error);
        });
    });
}

util.inherits( Profile, EventEmitter ); // Allows Profile to inherit functions from EventEmitter's prototype

module.exports = Profile;