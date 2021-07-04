// 3.12
// https://www.mongodb.com/cloud/atlas

// 3.12
// $ node mongo.js password Anna 040-1234556

const mongoose = require('mongoose')

if (process.argv.length < 2) {
  console.log('Please provide the password as an argument: npm start <password>')
  process.exit(1)
}

const password = process.argv[2]
//const name = process.argv[3]
//const phone = process.argv[4]

process.env.PASSWORD = password

console.log('process.env.PASSWORD', process.env.PASSWORD)

//const url = process.env.MONGODB_URI
//const url = "mongodb+srv://fullstack:" + process.env.PASSWORD + "@cluster3-13.pmolw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

const url = "mongodb+srv://fullstack:+""+@cluster3-13.pmolw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

//console.log('name', name, 'phone', phone)

console.log('url', url)

//const url = "mongodb+srv://fullstack:" + password + "@cluster3-13.pmolw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(result => {
    console.log('connected to MongoDB')
  })
.catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// 3.13
module.exports = mongoose.model('Person', personSchema)
