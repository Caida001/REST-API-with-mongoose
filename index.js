const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/test', {useMongoClient: true})


const logger = require('morgan')
const express = require('express')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')

let app = express()
app.use(logger('dev'))
app.use(bodyParser.json())

const Account = mongoose.model('Account', { name: String, balance: Number})

app.get('/accounts', (req, res, next) => {
  Account.find({}, null, {sort: {_id: -1}}, (err, accounts) => {
    if(err) return next(err)
    res.send(accounts)
  })
})

app.post('/accounts', (req, res, next) => {
  let newAccount = new Account(req.body)
  newAccount.save((err, results) => {
    if(err) return next(err)
    res.send(results)
  })
})

app.put('/accounts/:id', (req, res, next) => {
  Account.findById(req.params.id, (err, account) => {
    if(err) return next(err)
    if(req.body.name) account.name = req.body.name
    if(req.body.balance) account.balance = req.body.balance
    account.save((err, result) => {
      if(err) return next(err)
      res.send(result)
    })
  })
})

app.delete('/accounts/:id', (req, res, next) => {
  Account.findById(req.params.id, (err, account) => {
    if(err) return next(err)
    account.remove((err, result) => {
      if(err) return next(err)
      res.send(result)
    })
  })
})

app.use(errorhandler())

app.listen(3000)
