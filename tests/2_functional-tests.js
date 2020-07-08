/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http')
const chai = require('chai')
const server = require('../server')

const assert = chai.assert
chai.use(chaiHttp)

suite('Functional Tests', function () {
  suite('API ROUTING FOR /api/threads/:board', function () {
    suite('POST', function () {
      test('add a new thread', function (done) {
        chai.request(server)
          .post('/api/threads/test')
          .type('form')
          .send({
            'text': 'thread text',
            'delete_password': 'thread password'
          })
          .end(function (err, res) {
            assert.equal(err, null)
            assert.match(res.redirects, /\/b\/test\/$/)
            done()
          })
      })
    })

    suite('GET', function () {
      test('list recent threads', function (done) {
        chai.request(server)
          .get('/api/threads/text')
          .end(function (err, res) {
            assert.equal(err, null)
            assert.equal(res.status, 200)
            done()
          })
      })
    })

    suite('DELETE', function () {

    })

    suite('PUT', function () {

    })
  })

  suite('API ROUTING FOR /api/replies/:board', function () {
    suite('POST', function () {

    })

    suite('GET', function () {

    })

    suite('PUT', function () {

    })

    suite('DELETE', function () {

    })
  })
})
