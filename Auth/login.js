const { Router } = require('express')
let route = Router()
let UserModel = require('../Schema')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken')

route.get('/', (req, res) => {
    UserModel.find({}, (err, doc) => {
        res.json(doc)
    })
})

route.post('/', (req, res) => {
 
    let loginuser = req.body.username;
    let loginpassword = req.body.password; 
    UserModel.findOne({ 'username': loginuser.toLowerCase() }, (err, user) => {
        if(err) res.status(500).send({ message: err.message || "Some error creating Users" });
        else{ 
            if (user) { 
                bcrypt.compare(loginpassword, user.password, (err, result) => {
                    if (result) { 
                        const token = jwt.sign({ 'id': user.id }, 'process.env.Secretkey', {
                            algorithm: "HS256" })
                        
                    //     res.cookie("token", token, { maxAge: 5 * 60 * 1000 }) 
                   
                    res.send({"token":token})
                 }
                    else {
                        res.status(403).send({ message: "Password is Incorrect" });
                    }
                })
            }
            else {
                res.status(403).send({ message: "User Name is Incorrect" });
            }
        }
       
    })
})
module.exports = route