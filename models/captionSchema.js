/* Documentation: Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
   Defining models: Models are defined through the Schema interface by defining defining the structure of your documents and the types of data you're storing */
const mongoose = require('mongoose');

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new CaptionSchema object
// This is similar to a Sequelize model
const CaptionSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type: String,
        required: true,
        unique: true
    },
    URL: {
        type: String,
        required: true
    },
    dateScraped: {
        type: Date,
        default: Date.now
    }
});

// This creates our model from the above schema, using mongoose's model method
//  mongoose.model('ModelName', mySchema)
const Caption= mongoose.model("Caption", UserSchema);

// Export the User model
module.exports = Caption;