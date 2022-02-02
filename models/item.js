const mongoose = require('mongoose')

var utc = new Date()
utc.setHours( utc.getHours() + 2)

const itemSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  delivery: {
    type: String,
    required: false
  },
  seller: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: false
  },
  created: {
    type: Date,
    default: utc
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

itemSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Item', itemSchema)