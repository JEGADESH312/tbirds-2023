const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
let UserModel = require('../Schema');
var jwt = require('jsonwebtoken')



let salt = 10;


router.post('/', (req, res) => {
    UserModel.findOne({ 'username': req.body.username.toLowerCase() }).then(val => {
        if (val) {
            res.status(409).send({ message: `${req.body.username} already taken` });
        }
        else {
            bcrypt.genSalt(salt, function (err, salt) {
                bcrypt.hash(req.body.password, salt, function (err, hash) {
                    if (!err) {
                        var newuser = new UserModel({
                            username: req.body.username.toLowerCase(),
                            email: req.body.email,
                            password: hash
                        })
        
                        newuser.save(function (err, user) {
                            if (!err){
                                const token = jwt.sign({ 'id': user.id }, 'process.env.Secretkey', {
                                    algorithm: "HS256" })                                 
                            res.send({"token":token})
                            }  
                            else {
                                res.status(500).send({
                                    message: err.message || "Some error occurred while creating the User."
                                });
                            }
                        });
                    }
        
                    else res.status(500).send({ message: err.message || "Some error creating Users" });
                });
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred."
        });
    })
  
 
})

router.post('/isuserexist', (req, res) => {
    UserModel.findOne({ 'username': req.body.username }).then(val => {
        if (val) {
            res.status(409).send({ message: `${req.body.username} already taken` });
        }
        else {
             
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred."
        });
    })

})
module.exports = router;

//   var numSaltRounds = 10;
//             bcrypt.genSalt(numSaltRounds, function(err, salt) {
//                 bcrypt.hash(req.body.password, salt, function(err, hash) {
//                     var newuser = new model.user({
//                         username: req.body.username.toLowerCase(),
//                         email: req.body.email,
//                         password: hash
//                     }) 
//                  newuser.save().then(data => {
//                      console.log(data);
//             // res.redirect('/exist') 
//         })

//                 });
//            });