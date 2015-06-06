
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var prefix = '/api'
var tables = {};

app.use(bodyParser.json())

createModel('user')
createModel('blog')

var port = process.env.PORT || 3000
app.listen(port)
console.log('start from http://localhost:' + port)

function createModel (name) {
  var model = require('./models/' + name + '.js')
  var createValid = function (inputs, output) {
    return function valid (key) {
      if (!(inputs[key] instanceof model[key]))
        return new Error('invalid type on: ' + key)
      else
        output[key] = req.body[key]
    }
  }
  var createRespondor = function (errs, input) {
    if (errs.length > 0) {
      return function badRequest (res) {
        res.status(422).end(errs.join(', '))
      }
    } else {
      return function ok (res, code) {
        if (!input.id) input.id = random.digits(10)
        tables[name][input.id] = input
        res.status(code || 200).json(input)
      }
    }
  }

  tables[name] = {}
  app.get(
    prefix + '/' + name + 's',
    function (req, res) {
      res.send(tables[name])
    }
  )
  app.post(
    prefix + '/' + name + 's',
    function (req, res) {
      var data = {}
      var errs = Object.keys(model).filter(
        createValid(req.body, data)
      )
      createRespondor(errs, input)(res, 201) 
    }
  )
  app.get(
    prefix + '/' + name + 's/:id',
    function (req, res) {
      var record = tables[name][req.params.id]
      if (record)
        res.status(200).end(record)
      else
        res.status(204).end()
    }
  )
  app.patch(
    prefix + '/' + name + 's/:id',
    function (req, res) {
      var record = tables[name][req.params.id]
      if (record) {
        var errs = Object.keys(model).filter(
          createValid(req.body, record)
        )
        createRespondor(errs, record)(res, 200) 
      } else {
        res.status(404).end()
      }
    }
  )
  app.delete(
    prefix + '/' + name + 's/:id',
    function (req, res) {
      delete tables[name][req.params.id]
    }
  )
}

