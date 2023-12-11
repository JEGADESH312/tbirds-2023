const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')
var jwt = require('jsonwebtoken')
const app = express()
let os = require('os');
const path = require('path');
let network = interface = os.networkInterfaces()
 
 
// let ip = network['Wi-Fi'][3]['address']
 
let port = 5000

app.use(express.static(path.join(__dirname, '/client/build')))

mongoose.connect('mongodb+srv://Admin:Airserve3@cluster0.kareb.mongodb.net/TBIRDS?retryWrites=true&w=majority', {
    useNewUrlParser: true,
})
mongoose.connection.on("connected", (err, res) => {
    console.log("Database is connected")
})
mongoose.connection.on("error", err => {
    console.log("err", err.message)
})

app.use(express.json())
app.use(cors())
app.get('/account',(req,res)=>{
    res.redirect('/')
})

app.get('/',(req, res) =>{
    res.render('index.html');
});


app.use('/users', require('./Users')) 



app.use("/Geo",   require('./geo'))
app.use("/Properties",   require('./Properties'))
 



app.listen(port,   () => {
    console.log(`Listening @ $  at port number ${port} `);
})


// module.exports = app;