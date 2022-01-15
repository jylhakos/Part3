# Node.js, Express, MongoDB, Heroku, and React

Node.js, Express, MongoDB and React make the application fullstack deployed to Heroku.

**Node.js**

The one of the task implemented in the backend server is to offer data in the JSON format to the frontend.

Using non-blocking asynchronous APIs is important on Node because Node is a single-threaded event-driven execution environment.

An asynchronous API is one in which the API will start an operation and immediately return before the operation is complete.

A common way to notify your application that it has completed is to register a callback function when you invoke the asynchronous API, that will be called back when the operation completes.

A web server is created by using createServer method and the function that handles requests in createServer is called once for every HTTP request that's made against that Node.js server.

When receiving  POST or PUT request, the request body might be important to the application. 

**npm**

The npm is a tool used for managing JavaScript packages.

Use the npm init command to create a package.json file for the application.

```

$ npm init


```

The result is a generated package.json file at the root of the project directory.

```

{
  "name": "app",
  "version": "1.0.0",
  "description": "application",
  "main": "index.js",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "mongoose": "^5.13.1",
    "mongoose-unique-validator": "^2.0.3",
    "nodemon": "^2.0.7"
  },
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}

```

The package.json file defines, for example that the main entry point of the application is the index.js file.

You can type node index.js on the command line to start the app.

```

$ node index.js


```

You can run the program as an npm script using the npm command defined in package.json file.

```

$ npm start


```
**Routing**

Routes allow the server to match particular patterns of characters in a URL, and extract values from the URL and pass them as parameters to the route handler.

```

const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Note = require('./models/note')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

```

The script imports express module, which is a function that is used to create an express application stored in the app variable.

The script binds the http server assigned to the app variable, to listen to HTTP requests sent to the port 3000.

The application/json value in the Content-Type header informs the receiver that the data is in the JSON format.

Routing refers to how an application’s endpoints respond to client requests.

Route paths, in combination with a request method, define the endpoints at which requests can be made.

Route parameters are named URL segments that are used to capture the values specified at their position in the URL.

The first route defines an event handler that is used to handle HTTP GET requests made to the application's / root path.

The second route defines an event handler that handles HTTP GET requests made to the notes path.

The methods on the response object can send a response to the client, for example the request is answered by using the send method of the response object.

The callback function takes a request and a response object as arguments, and calls send() on the response to return the string "Notes" to the client.

**Express**

Express is server framework for Node.js server.

Express has an interface to work with the built-in http module.

There are approaches for interacting with a database using either the databases' native query language (SQL) or using an Object Data Mapper (ODM) or an Object Relational Model (ORM).

Install Express as a dependency to package.json file using the --save flag.

```

$ npm install express --save

```

Express provides methods to specify what function is called for a particular HTTP verb (GET, POST, PUT, etc.) and URL pattern for route path.

**MongoDB**

Mongoose is  MongoDB object modeling interface to work in an asynchronous environment.

Mongoose is described as an Object Data Mapper (ODM), and saving JavaScript objects as MongoDB documents.

When designing what data is needed to store and the relationships between the different objects it makes sense to have separate models for every "object" (a group of related information).

```

$ npm install mongodb mongoose

```

```

const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.ostce.mongodb.net/fs2021-notes?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'CSS is hard',
  date: new Date(),
  important: true,
})

/*
note.save().then(response => {
  console.log('note saved!')
  mongoose.connection.close()
})
*/

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})

```

After establishing the connection to the database, we define the schema using mongoose.Schema method for a note and the matching model.

The Schema allows you to define the fields stored in each document along with their validation requirements and default values.

Schemas are then "compiled" into models using the mongoose.model() method.

The ObjectId represents the instances of a model in the database. 

Validation allows you to specify both the acceptable range of values and the error message for validation failure.

To create a record you can define an instance of the model and then call save() method.

You can search for records using query methods, specifying the query conditions as a JSON document.

The objects are retrieved from the database with the find method of the Note model. 

```

const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)

```

**Heroku**

Heroku is a platform as a service (PaaS) that enables developers to build, run, and operate applications. 

Heroku uses the package.json file to find which scripts to run and which dependencies to install for the project.

Create an app on Heroku, which prepares Heroku to receive your source code.

When you create an app, then git remote (called heroku) is also created and associated with your local git repository.

The environment variable that defines the database URL in production should be set to Heroku with the heroku config:set command.

```

 $ heroku config:set MONGODB_URI=mongodb+srv://fullstack:secretpasswordhere@cluster0-ostce.mongodb.net/note-app?retryWrites=true

```

**React**

The top tier of the stack is React.js for creating client applications in HTML and Javascript. 

By making HTTP Requests from React.js app, you can connect to Express functions to access REST API routes. 

```

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3000/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }, [])
  console.log('render', notes.length, 'notes')

}

```
A link to Node.js document.

https://nodejs.org/api/synopsis.html

![alt text](https://github.com/jylhakos/Part3/blob/master/react.png?raw=true)
