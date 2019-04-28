/* Documentation: Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
   Defining models: Models are defined through the Schema interface by defining defining the structure of your documents and the types of data you're storing */
const mongoose = require('mongoose');

// Documentation: With Mongoose, everything is derived from a Schema.
// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new CaptionSchema object
// This is similar to a Sequelize model
const ArticleSchema = new Schema({
    title: {
        type: String,
        // required: true,
        // unique: true
    },
    URL: {
        type: String,
        // required: true,
        unique: true
        // required: true
    },
    summary: {
        type: String
    //     required: true,
    //     unique: true,
    //     validate: [
    //         function(input) {
    //           return input.length <= 300;
    //         },
    //         "too long"
    //     ]
    },
    dateScraped: {
        type: Date,
        default: Date.now
    }
});

/* Documentation: 
    * NOTE: methods must be added to the schema before compiling it with mongoose.model()
    * Functions added to the methods property of a schema get compiled into the Model prototype
    and exposed on each document instance.
    * The next step is compiling our schema into a Model.
    mongoose.model('ModelName', mySchema)
*/
// This creates our model from the above schema, using mongoose's model method
const Article= mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;

/* Documentation: A model is a class with which we construct documents. 
In this case, each document will be [ an Article ] with properties and behaviors as declared in our schema. 

Instances of Models are documents.
Documents have many of their own built-in instance methods. 
We may also define our own custom document instance methods too.
*/