const express = require('express')
const cors = require('cors')
const app = express()
let os = require('os');
const path = require('path');
//let network = interface = os.networkInterfaces()
 
 
// let ip = network['Wi-Fi'][1]['address']
 
let port = 5000

//app.use(express.static(path.join(__dirname, '/client')))


app.use(express.json())
app.use(cors())


app.get('/', function(req, res) {
   res.send("Application")
});





app.use("/Geo",   require('./geo'))
//app.use("/Properties",   require('./Properties'))
 



app.listen(port,   () => {
    console.log(`Listening @   at port number ${port} `);
})


module.exports = app;
