const express = require('express')
require('dotenv').config()

const api = express()
api.use(express.json())

module.exports = api