
var app = require('../../app')
var request = require('supertest')

describe('http.blog', function () {
  describe('GET /blogs/', function () {
    it('should just return the empty object', function (next) {
      request(app).get('/api/blogs/').expect(200, onresponse)
      function onresponse (err, res) {
        next(err)
        assert.deepEqual(res.body, {})
      }
    })
  })
})

