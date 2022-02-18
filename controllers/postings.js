const postingsRouter = require('express').Router()
const Posting = require('../models/posting')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

postingsRouter.get('/', async (request, response) => { 
  const postings = await Posting.find({}).populate('user', { username: 1, name: 1 })
  response.json(postings.map(posting => posting.toJSON()))
})

postingsRouter.get('/location', async (req, res) => {
  const query = req.query.query
  console.log(query)
  const postings = await Posting.find({ location: query }).populate('user', { username: 1, name: 1 })
  res.json(postings.map(posting => posting.toJSON()))
})

postingsRouter.get('/category', async (req, res) => {
  const query = req.query.query
  console.log(query)
  const postings = await Posting.find({ category: query }).populate('user', { username: 1, name: 1 })
  res.json(postings.map(posting => posting.toJSON()))
})

postingsRouter.get('/date', async (req, res) => {
  const query = req.query.query
  console.log(query)
  const postings = await Posting.find({ 'created': {'$gte': query }}).populate('user', { username: 1, name: 1 })
  res.json(postings.map(posting => posting.toJSON()))
})

postingsRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  let posting = new Posting({
    'title': body.title,
    'description': body.description,
    'category': body.category,
    'location': body.location,
    'images': body.images,
    'price': body.price,
    'delivery': body.delivery,
    'seller': body.seller,
    'contact': body.contact,
    'created': body.created,
    'user': user._id
  })
  
  const savedposting = await posting.save()
  user.postings = user.postings.concat(savedposting._id)
  await user.save()
  response.json(savedposting.toJSON())
})

postingsRouter.delete('/:id', async (req, res) => {
  const id = req.params.id

  const posting = await Posting.findById(id)
  const token = req.token

  if (!posting) {
    return res.status(400).json({ error: 'posting not found' })
  }
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!decodedToken.id || posting.user.toString() !== decodedToken.id) {
    return res.status(401).json({ error: 'token invalid or missing' })
  } else {
    const deletedposting = await Posting.findByIdAndRemove(id)
    res.json(deletedposting.toJSON())
  }
})

postingsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const id = request.params.id

  const posting = await Posting.findById(id)
  const token = request.token

  if (!posting) {
    return response.status(400).json({ error: 'posting not found' })
  }
  const decodedToken = jwt.verify(token, process.env.SECRET)

  const newposting = {
    title: body.title,
    description: body.description,
    category: body.category,
    location: body.location,
    images: body.images,
    price: body.price,
    delivery: body.delivery,
    seller: body.seller,
    contact: body.contact,
  }

  if (!decodedToken.id || posting.user.toString() !== decodedToken.id) {
    return response.status(401).json({ error: 'token invalid or missing' })
  } else {
    await Posting.findByIdAndUpdate(request.params.id, newposting, { new: true})
    response.status(200).end()
  }
})

module.exports = postingsRouter