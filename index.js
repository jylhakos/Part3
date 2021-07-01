const express = require('express')
const app = express()

// 3.7
var fs = require('fs');
const morgan = require('morgan')
var stream = fs.createWriteStream(__dirname + '/3.7.log',{flags: 'a'});
app.use(morgan('tiny', {stream: stream}));
//var options = {stream: stream}
// 3.8
//morgan.token('type', function (req, res) { return req.headers['content-type'] })
//morgan.token('3.7', ":http-version (:'POST') :url => :status ")
//app.use(morgan({format: 'POST body length in bytes :req[Content-Length]', immediate: true}, options))
//morgan.token('3.7', ":http-version (:'POST') :url => :status ")
//morgan.token('3.8', (tokens, req, res) => {
//  return [
//    :http-version 
//    (:'POST') 
//    :url => :status
//  ]
//})

//app.use(morgan('3.8', {stream: stream}));
app.use(morgan('3.7', {stream: stream}));
// https://github.com/expressjs/morgan

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

// 3.5
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// 3.5
const generateId = () => {
  const max = 8589934592
  const min = persons.length
  //const min = persons.length > 0
  //  ? Math.max(...persons.map(n => n.id))
  //  : 0console.log('id', id)
  console.log('min', min)

  id = getRandomInt(min,max)

  console.log('id', id)

  return id
}

// 3.6
function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// 3.6
function isKeyEmpty(key) {
  return (key === undefined || key == null || key.length <= 0) ? true : false;
}

function hasKeyValue(obj, value) {
  console.log('obj', obj)
  console.log('value', value)
  
  for (var i=0; i < obj.length; i++) {
    console.log('obj[i].name]', obj[i].name)
    if(obj[i].name == value) {
      console.log('return', true)
      return true
    }
  }
  console.log('return', false)
  return false
}

function checkValidity(request, response) {

  const content = request.body

  console.log('checkValidity', content)

  if(isObjectEmpty(content)) {
    console.log('error: content is empty')
    return response.status(400).json({
    status: 'error',
    error: 'error: request content is empty',
  })} else if (content.hasOwnProperty('name') === false) {
    console.log('error: has not name')
    return response.status(400).json({error: 'error: has not name'})
  } else if (isKeyEmpty(content.name)) {
    console.log('error: name is empty')
    return response.status(400).json({
      status: 'error',
      error: 'error: name is empty'})
  } else if (content.hasOwnProperty('phone') === false) {
    console.log('error: has not phone')
    return response.status(400).json({error: 'error: has not phone'})
  } else if (isKeyEmpty(content.phone)) {
    console.log('error: phone is empty')
    return response.status(400).json({
      status: 'error',
      error: 'error: phone is empty'})
  } else {
    console.log('content.name', content.name)

    const exists = hasKeyValue(persons,content.name)

    console.log('exists', exists)

    if (exists) {
      console.log('error: name must be unique')
      return response.status(400).json({ 
        status: 'error',
        error: 'error: name must be unique'})
    }
  }

  return null
}

// 3.0
app.get('/', (request, response) => {
  response.send('<h1></h1>')
})

// 3.1
app.get('/api/persons', (request, response) => {
  console.log(persons)
  return response.json(persons)
})

// 3.2
app.get('/info', (request, response) => {

  let dateTime = new Date();

  dateTime.toGMTString('en-US', { timeZone: 'Europe/Helsinki' });

  let info = "<div>Phonebook has info for " + persons.length + " people</div>" + "<br>" + dateTime + "</br>"

  console.log(info)

  return response.send(info)

})

// $ curl -X "GET" "http://localhost:3001/api/persons/2"

// 3.3
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

// 3.4
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

// 3.5, 3.6
app.post('/api/persons', (request, response) => {

  console.log('request.body', request.body)

  const content = request.body

  var result = null

  result = checkValidity(request,response)

  console.log('result', result)

  if (result == null) {

    const person = {
      name: content.name,
      phone: content.phone,
      id: generateId(),
    }

    persons = persons.concat(person)

    console.log(person)

    return response.json(person)
  }
})

//curl -X POST http://localhost:3001/api/persons -H "Content-Type: application/json" -d "{\"name\":\"Jane Austin\", \"phone\":\"0123456789\"}"

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
