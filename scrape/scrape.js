// Our scraping tools
// require dependencias to scrape www.wsj.com
var cheerio = require("cheerio");
var axios = require("axios");

var scrape = axios.get("https://www.wsj.com/").then(function(response) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);
  
    // An empty array to save the data that we'll scrape
    var results = [];

    $("div .cb-row").each(function(i, element) {
        var title = $(element).children().find("a").text().trim();
        var summary = $(element).find("p span").text();
        var link = $(element).find("h3 a").attr("href");
        results.push({
            title: title,
            summary: summary,
            link: link
        });
    });
    
    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);
});

module.exports = scrape;