const express = require('express')
require('dotenv').config()

const api = express()
api.use(express.json())

api.get('/test', (req, res) => {
    res.send({ status: "OK" })
})

module.exports = api