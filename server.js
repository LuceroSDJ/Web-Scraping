var cheerio = require("cheerio");
var axios = require("axios");

// What it the server.js file doing?
console.log("\n********************\n" +
        "Grabbing side nav 'text', 'link' and 'class'\n" +
        "from w3schools.com :" +
        "\n**********************\n");

// Make a request via axios for w3schools.com to grab the HTML body from this site
// The page's response is passed as our promise argument
axios.get("https://www.w3schools.com/").then(function(response) {

    // IMOPRTANT STEP HERE
    // Load the response into cheerio & save it to variable '$'
    // Notes: '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);

    // An empty array to save the data that we'll scrape
    var results = [];

    // Now, we use cheerio to find the desired tag/s
    // Notes: (i: iterator. element: the current element)
    $("nav a").each(function(i, element) {
        var text = $(element).text();
        var link = $(element).attr("href");
        var cls = $(element).attr("class");
        results.push({
          text: text,
          link: link,
          class: cls
        });
    }); // grabbing tags with cheerio ends

    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);
}); // request via axios for w3schools.com ends
