const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
      "name": "Arto Hellas",
      "phone": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "phone": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "phone": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "phone": "39-23-6423122",
      "id": 4
    }
  ]

app.get('/', (request, response) => {
  response.send('<h1></h1>')
})

app.get('/api/persons', (request, response) => {
  console.log(persons)
  response.json(persons)
})

app.get('/info', (request, response) => {

  let dateTime = new Date();

  dateTime.toGMTString('en-US', { timeZone: 'Europe/Helsinki' });

  let info = "<div>Phonebook has info for " + persons.length + " people</div>" + "<br>" + dateTime + "</br>"

  console.log(info)

  response.send(info)

})

// $ curl -X "GET" "http://localhost:3001/api/persons/2"

app.get('/api/persons/:id', (request, response) => {

  const id = Number(request.params.id)

  console.log('GET', '/api/persons/' + id)
  
  const person = persons.find(person => person.id === id)
  
  console.log(person)
  
  if (person) {

    response.json(person)

  } else {

    response.status(404).end()

  }

})

// $ curl -X "DELETE" "http://localhost:3001/api/persons/2"

app.delete('/api/persons/:id', (request, response) => {

  const id = Number(request.params.id)

  console.log('DELETE', '/api/persons/' + id)

  const person = persons.filter(person => person.id === id)

  const index = persons.findIndex(function(person, i) {
    return person.id === id
  });

  console.log('person', person)

  if (person) {

    persons.splice(index, 1);

    response.status(204).end()

  } else {

    response.status(404).end()
    
  }
})


const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})