const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const expect = require('chai').expect

describe('TEST /api/postings', function() {

  it('status code 200', function (done) {
    api
      .get('/api/postings')
      .expect(200)
      .end(function (err, res) {
        const result = res.statusCode
        expect(result).to.equal(200)
        done()
      })
  })

  it('content returns as json', function(done) {
    api
      .get('/api/postings')
      .expect('Content-Type', /application\/json/)
      .end(function (err, res) {
        const result = res.statusCode
        expect(result).to.equal(200)
        done()
      })
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

  const wrong = {
    username: 'väärä',
    password: 'väärä'
  }

  const test = {
    username: 'test',
    password: 'test'
  }

  it('login with wrong password or username', async function() {
    await api
      .post('/api/login')
      .send(wrong)
      .expect(401)
  })

  it('test login', async function() {
    await api
      .post('/api/login')
      .send(test)
      .expect(200)
  })
})