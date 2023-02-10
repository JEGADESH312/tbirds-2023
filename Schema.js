const {Schema,model}=require('mongoose');

let UsersSchema=new Schema({
    username:String,
    email:String,
    password:String
})

module.exports =model("users",UsersSchema)