// require scrape & our two controllers
// var scrape = require("../scrape/scrape");

// var headlinesController = require("../controllers/headlines");
// var notesController = require("../controllers/notes");


// module.exports to export routes to the Server.js file 
//in order to  ==== render handlebars templates ========
module.exports = function(app) {
    app.get("/", function(req, res) {
        res.render("home");
        // return "hello saved";
    });
    // render saved handlebars page which I don't have yet
    // router.get("/saved", function(req, res) {
    //     // res.render("saved");
    //     return "hello saved";
    // });
}

// Then, require this route in the server.js file