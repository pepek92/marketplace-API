const itemsRouter = require('express').Router()
const Item = require('../models/item')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

itemsRouter.get('/', async (request, response) => { 
  const items = await Item.find({}).populate('user', { username: 1, name: 1 })
  response.json(items.map(item => item.toJSON()))
})

itemsRouter.get('/location', async (req, res) => {
  const loc = req.query.loc
  console.log(loc)
  const items = await Item.find({ location: loc }).populate('user', { username: 1, name: 1 })
  res.json(items.map(item => item.toJSON()))
})

itemsRouter.get('/category', async (req, res) => {
  const cat = req.query.cat
  console.log(cat)
  const items = await Item.find({ category: cat }).populate('user', { username: 1, name: 1 })
  res.json(items.map(item => item.toJSON()))
})

itemsRouter.get('/date', async (req, res) => {
  const date = req.query.date
  console.log(date)
  const items = await Item.find({ 'created': {'$gte': date }}).populate('user', { username: 1, name: 1 })
  res.json(items.map(item => item.toJSON()))
})

itemsRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  let item = new Item({
    'title': body.title,
    'description': body.description,
    'category': body.category,
    'location': body.location,
    'price': body.price,
    'delivery': body.delivery,
    'seller': body.seller,
    'contact': body.contact,
    'created': body.created,
    'user': user._id
  })
  
  const savedItem = await item.save()
  user.items = user.items.concat(savedItem._id)
  await user.save()
  response.json(savedItem.toJSON())
})

itemsRouter.delete('/:id', async (req, res) => {
  const id = req.params.id

  const item = await Item.findById(id)
  const token = req.token

  if (!item) {
    return res.status(400).json({ error: 'item not found' })
  }
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!decodedToken.id || item.user.toString() !== decodedToken.id) {
    return res.status(401).json({ error: 'token invalid or missing' })
  } else {
    const deletedItem = await Item.findByIdAndRemove(id)
    res.json(deletedItem.toJSON())
  }
})

itemsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const id = request.params.id

  const item = await Item.findById(id)
  const token = request.token

  if (!item) {
    return response.status(400).json({ error: 'item not found' })
  }
  const decodedToken = jwt.verify(token, process.env.SECRET)

  const newItem = {
    title: body.title,
    description: body.description,
    category: body.category,
    location: body.location,
    price: body.price,
    delivery: body.delivery,
    seller: body.seller,
    contact: body.contact,
  }

  if (!decodedToken.id || item.user.toString() !== decodedToken.id) {
    return response.status(401).json({ error: 'token invalid or missing' })
  } else {
    await Item.findByIdAndUpdate(request.params.id, newItem, { new: true})
    response.status(200).end()
  }
})

module.exports = itemsRouter