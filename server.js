// **** Our scraping tools!!! ****
//require npm dependencies
var cheerio = require("cheerio");
var axios = require("axios");

var express = require("express");
var exphbs  = require('express-handlebars');
const mongoose = require('mongoose');

// initialize express
var app = express();
// require routes from routes.js in order to render handlebars files 
/* ======= Documentation: ==========
Routing refers to how an application’s endpoints (URIs) respond to client requests.
You define routing using methods of the Express app object that correspond to HTTP methods; 
for example, app.get() to handle GET requests and app.post to handle POST requests.
You can use app.use() to specify middleware as the callback function.
Bind application-level middleware to an instance of the app object by using the app.use() and app.METHOD() functions
*/
require("./config/routes")(app);

// Require all models
var db = require("./models");

// require scrape & our two controllers
var scrape = require("./scrape/scrape");

// set up port  to 3000 or process.env.PORT for deployment
var PORT = process.env.PORT || 3000;


// Configure middleware
//Set up the Express app to handle data parsing
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// create publi static folder
app.use(express.static(__dirname + "/public"));

/* Documentation: Connecting to MongoDB
First, we need to define a connection. 
If your app uses only one database, you should use mongoose.connect. 
If you need to create additional connections, use mongoose.createConnection.
Both connect and createConnection take a mongodb:// URI, or the parameters host, database, port, options.
*/
// Connect to the Mongo DB 
// mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true});

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  // debug cli mssg: [(node:1336) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.]
  useCreateIndex: true
});

// Register `hbs.engine` with the Express app
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
// documentation: create views/layouts/main.handlebars

// ============= ROUTES ===========================

// What it the server.js file doing?
console.log("\n********************\n" +
        "Grabbing side nav 'text', 'link' and 'class'\n" +
        "from wsj.com :" +
        "\n**********************\n");

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.wsj.com/").then(function(response) {
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);

    // Now, we grab every class=cb-row within the corresponding div tag, and do the following:
    $("div .cb-row").each(function(i, element) {
      // Save an empty result object
      var result = {};
      //var title = $(element).children().find("a").text().trim();
      result.title = $(this)
      .children()
      .find("a")
      .text()
      .trim();
      //var link = $(element).find("h3 a").attr("href");
      result.link = $(this)
      .find("h3 a")
      .attr("href");
      //var summary = $(element).find("p span").text();
      result.summary = $(this)
      .find("p span")
      .text();

      // Create a new Article using the `result` object built from scraping
      db.Caption.create(result)
        .then(function(dbCaption) {
          console.log(dbCaption);
        })
        .catch(function(err) {
          console.log(err);
        });
    }); //cheerio grab html ends
    // send message to client
    res.send("Scrape complete!");  //works as expected
  }); //axios.get ends
}); //app.get /scrape ends



app.listen(process.env.PORT || 3000, function() {
  console.log("App listening on PORT: " + PORT);  //app listening ✓
});
