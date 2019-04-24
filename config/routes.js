// module.exports to export routes to the Server.js file in order to render handlebars templates
module.exports = function(router) {
    router.get("/", function(req, res) {
        res.render("home");
    });
}

// Then, require this route in the server.js file