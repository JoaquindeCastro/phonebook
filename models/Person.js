require("dotenv").config()
const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const URI = process.env.MONGO_URI

console.log("Connecting to ", URI, "...")

mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => console.log("Connected to MongoDB"))
  .catch(err => console.log("Error connecting to MongoDB: ", err.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: 3
  },
  number: {
    type: String,
    required: true,
    minLength: 8
  }
})
personSchema.plugin(uniqueValidator)
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Person", personSchema)