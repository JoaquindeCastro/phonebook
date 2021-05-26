require("dotenv").config()
const express = require("express")
const morgan = require("morgan")

const app = express()
morgan.token("body", (req, res) => JSON.stringify(req.body))
const logger = morgan(":method :url :status :response-time ms - :res[content-length] :body")

const Person = require("./models/Person.js")

app.use(express.json())
app.use(logger)
app.use(express.static("build"))

app.get("/api/persons", (req, res) => {
  Person.find().then(result => {
    res.json(result)
  })
})

app.get("/info", (req, res) => {
  Person.count()
    .then(length => res.send(`<p>Phonebook has info for ${length} people</p><p>${Date()}</p>`))
})

app.get("/api/persons/:id", (req, res, next) => {
  Person
    .findById(req.params.id)
    .then(result => {
      if (result) {
        res.json(result)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

app.post("/api/persons", (req, res, next) => {
  const newPerson = req.body
  const newPersonDocument = new Person({
    name: newPerson.name,
    number: newPerson.number
  })
  newPersonDocument.save()
    .then(result => {
      console.log("New document created")
      res.json(result)
    })
    .catch(err => next(err))
})

app.put("/api/persons/:id", (req, res, next) => {
  const updatedPerson = req.body
  const number = updatedPerson.number
  Person.findByIdAndUpdate(req.params.id, { number: number }, { new: true, runValidators: true })
    .then(result => {
      console.log(result)
      return res.status(200).json(result)
    })
    .catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "Unknown Endpoint" })
}

const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === "CastError") {
    return res.status(400).json({ error: "Malformatted ID" })
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message })
  }

  next(err)
}

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})