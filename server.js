// require dependencies
var express = require("express");
var logger = require("morgan");
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

// **** Our scraping tools!!! ****
//require npm dependencies
var cheerio = require("cheerio");
var axios = require("axios");

require("./config/routes")(app);

// Require all models [captionSchemas & noteSchema]
var db = require("./models");


// set up port  to 3000 or process.env.PORT for deployment
var PORT = process.env.PORT || 3000;


// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
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
        "Grabbing data\n" +
        "from website :" +
        "\n**********************\n");

// A GET route for scraping the website
// app.get("/scrape", function(req, res) {
//   // First, we grab the body of the html with axios
//   axios.get("https://www.wsj.com/").then(function(response) {
//     // Load the HTML into cheerio and save it to a variable
//     // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
//     var $ = cheerio.load(response.data);

//     // Now, we grab every class=cb-row within the corresponding div tag, and do the following:
//     $("div .cb-row").each(function(i, element) {
//       // Save an empty result object
//       var result = {};
//       //var title = $(element).children().find("a").text().trim();
//       result.title = $(this)
//       .children("a")
//       // .find("a")
//       .text()
//       .trim();
//       //var link = $(element).find("h3 a").attr("href");
//       result.link = $(this)
//       .children("h3 a")
//       .attr("href");
//       //var summary = $(element).find("p span").text();
//       result.summary = $(this)
//       .children("p span")
//       .text();
// ========== TEST =========== CLASS ACTIVITY =====
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  
  axios.get("https://www.npr.org/sections/music-videos/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    $("article").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children()
        .find("h2")
        .text()
        .trim();
      result.link = $(this)
        .children().find("h2 a")
        .attr("href");
      result.summary = $(this)
        .children()
        .find("p time")
        .text()
        .trim();
      console.log(result);
//     })
//   });
// });

    // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
          //send them back to the client
          // res.json(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    }); //cheerio grab html ends
    // send message to client
    res.send("Scrape complete!");  //works as expected
  }); //axios.get ends
}); //app.get /scrape ends

// ============ Route for getting all Articles from the db =========
// app.get("/articles", function(req, res) {
//   // Grab every document in the Articles collection
//   db.Article.find({})
//     .then(function(dbArticle) {
//       // If we were able to successfully find Articles, send them back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// ============ Route for Deleting all articles from the database ==========



app.listen(process.env.PORT || 3000, function() {
  console.log("App listening on PORT: " + PORT);  //app listening ✓
})
