const router = require('express').Router()
const Item = require('../models/item')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  await Item.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router