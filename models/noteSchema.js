const mongoose = require('mongoose');

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
const NoteSchema = new Schema({
    // `captionIDs` is an array that stores ObjectIds
    // The ref property links these ObjectIds to the Caption model
    // This allows us to populate the notes with any associated captions  
    captionIDs: [
        {
          type: Schema.Types.ObjectId,
          ref: "Caption"
        }
    ],
    title: String,
    body: String
});

// This creates our model from the above schema, using mongoose's model method
//  mongoose.model('ModelName', mySchema)
const Note= mongoose.model("Note", NoteSchema);

// Export the User model
module.exports = Note;