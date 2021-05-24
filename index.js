const http = require('http');
const express = require('express');
const morgan = require('morgan')

const app = express();
morgan.token('body', (req, res) => JSON.stringify(req.body))
const logger = morgan(':method :url :status :response-time ms - :res[content-length] :body')

app.use(express.json())
app.use(logger)
app.use(express.static('build'))

let people = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    },
    {
      "name": "Joaquin de Castro",
      "number": "09563866607",
      "id": 5
    }
  ]

app.get('/api/persons',(req,res) => {
    res.json(people)
})

app.get('/info',(req,res) => {
    res.send(`<p>Phonebook has info for ${people.length} people</p><p>${Date()}</p>`)
})

app.get('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    const toGet = people.find(p => p.id === id)
    if (!toGet){
        res.status(404).end()
    }
    res.json(toGet)
})

app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    const toDelete = people.find(p => p.id === id)
    if (!toDelete){
        res.status(404).json({'error':`An entry with id ${id} was not found`})
    }
    people = people.map(p => p.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req,res) => {
    const newPerson = req.body
    if (!newPerson.name){
        return res.status(400).json({
            "error":"Don't forget to include the name."
        }).end()
    }
    if (!newPerson.number){
        return res.status(400).json({
            "error":"Don't forget to include the number."
        })
    }
    const names = people.map(p => p.name)
    if (names.includes(newPerson.name)){
        return res.status(400).json({
            "error":"This name is already in the phonebook."
        })  
    }
    newPerson['id'] = Math.floor(1000*Math.random())
    people = people.concat(newPerson)
    res.json(req.body)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})