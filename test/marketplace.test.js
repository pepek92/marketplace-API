const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const expect = require('chai').expect

describe('TEST /api/items', function() {

  it('status code 200', function(done) {
    api
      .get('/api/items')
      .expect(200)
      .end(function (err, res) {
        const result = res.statusCode
        expect(result).to.equal(200)
        done()
      })
  })

  it('content returns as json', function(done) {
    api
      .get('/api/items')
      .expect('Content-Type', /application\/json/)
      .end(function (err, res) {
        const result = res.statusCode
        expect(result).to.equal(200)
        done()
      })
  })

  it('creating an item without authorization', async function() {

    const testItem = {
      title: 'testi tuote',
      description: 'testi',
      category: 'testit',
      location: 'Helsinki',
      images: [],
      price: 1500,
      delivery: 'nouto',
      seller: 'Petteri K',
      contact: '050 2343366'
    }

    await api
      .post('/api/items')
      .send(testItem)
      .expect(401)
  })
})

describe('TEST /api/users', function() {

  it('status code 200', function(done) {
    api
      .get('/api/users')
      .expect(200)
      .end(function (err, res) {
        const result = res.statusCode
        expect(result).to.equal(200)
        done()
      })
  })

  it('content returns as json', function(done) {
    api
      .get('/api/users')
      .expect('Content-Type', /application\/json/)
      .end(function (err, res) {
        const result = res.statusCode
        expect(result).to.equal(200)
        done()
      })
  })
})

describe('TEST /api/login', function() {

  const kayttaja = {
    username: 'väärä',
    password: 'väärä'
  }

  it('login with wrong password or username', async function() {
    await api
      .post('/api/login')
      .send(kayttaja)
      .expect(401)
  })
})