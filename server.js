//require npm dependencies
var cheerio = require("cheerio");
var axios = require("axios");

var express = require("express");

// set up port  to 3000 or process.env.PORT for deployment
var PORT = process.env.PORT || 3000;

// initialize express
var app = express();

// set up an Express Router since we need to access our routes from a different file
/* Documentation: Router-level middleware works in the same way as application-level middleware, 
except it is bound to an instance of express.Router(). */
var router = express.Router();
/* ======= Documentation: ==========
Routing refers to how an application’s endpoints (URIs) respond to client requests.
You define routing using methods of the Express app object that correspond to HTTP methods; 
for example, app.get() to handle GET requests and app.post to handle POST requests.
You can use app.use() to specify middleware as the callback function.
Bind application-level middleware to an instance of the app object by using the app.use() and app.METHOD() functions
*/

// create publi static folder
app.use(express.static(__dirname + "/public"));

//Set up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// What it the server.js file doing?
console.log("\n********************\n" +
        "Grabbing side nav 'text', 'link' and 'class'\n" +
        "from w3schools.com :" +
        "\n**********************\n");

// Make a request via axios for w3schools.com to grab the HTML body from this site
// The page's response is passed as our promise argument
axios.get("https://www.w3schools.com/").then(function(response) {

    // IMOPRTANT STEP HERE
    // Load the response into cheerio & save it into variable '$'
    // Notes: '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);

    // An empty array to save the data that we'll scrape
    var results = [];

    // Now, we use cheerio to grab the desired tag/s
    // Notes: (i: iterator. element: the current element)
    $("nav a").each(function(i, element) {
        var text = $(element).text();
        var link = $(element).attr("href");
        // var cls = $(element).attr("class");
        results.push({
          text: text,
          link: "https://www.w3schools.com" + link,
          // class: cls
        });
    }); // grabbing tags with cheerio ends

    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);
}); // request via axios for w3schools.com ends

app.listen(process.env.PORT || 3000, function() {
  console.log("App listening on PORT: " + PORT);  //app listening ✓
});
