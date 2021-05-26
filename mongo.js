const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log("A MongoDB user password is needed to access the database.")
  process.exit(1)
}

const pwd = process.argv[2]

const url = `mongodb+srv://fullstack:${pwd}@cluster0.rinsy.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length < 4) {
  Person
    .find()
    .then(result => {
      console.log("Phonebook:")
      result.map(p => {
        console.log(p.name, " ", p.number)
      })
      mongoose.connection.close()
    })
} else if (process.argv.length < 5) {
  console.log("Please also provide an argument <number> for adding a new entry")
  process.exit(1)
} else if (process.argv.length < 6) {
  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  newPerson
    .save()
    .then(result => {
      console.log(result)
      mongoose.connection.close()
    })
}