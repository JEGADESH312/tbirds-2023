const { Router } = require('express')
const path = require('path');
let route = Router()

route.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'))
})
route.use('/login', require('./Auth/login'))
route.use('/createuser', require('./Auth/Signup'))
module.exports = route