const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.username === undefined || body.username.length < 3) {
    return response.status(400).json({error: 'username missing or too short!'})
  } else if (body.password === undefined || body.password.length < 3){
    return response.status(400).json({error: 'password missing or too short!'})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('postings', { 
      title: 1, 
      description: 1,
      category: 1,
      location: 1,
      images: 1,
      price: 1,
      delivery: 1,
      seller: 1,
      contact: 1,
      created: 1,
      id: 1 
    })
    
  response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter