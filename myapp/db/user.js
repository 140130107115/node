let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');
var findOneOrCreate = require('mongoose-findorcreate');

let schema = mongoose.Schema;

let userSchema = new schema({
    username: {
        type: String,
        unique: true
    },
    user_Id: {
        type: Number,
        required: true,
        unique: true
    },
    provider:{
        type : String,
        required : true
    },
    // password: {
    //     type: String,
    //     required: false
    // },
   name:{
       type : String,
       required : true
   }
})

userSchema.plugin(findOneOrCreate);


userSchema.methods.hashPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

userSchema.methods.comparePassword = function (password, hash) {
    return bcrypt.compareSync(password, hash);
}

module.exports = mongoose.model('users', userSchema, 'users');