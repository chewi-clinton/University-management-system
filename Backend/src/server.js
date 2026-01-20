const express = require('express')
const app = express()

// ...existing middleware/routes...

// register finance routes
app.use('/api/finance', require('./routes/finance'))

module.exports = app