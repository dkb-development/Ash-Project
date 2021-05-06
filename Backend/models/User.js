const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    join_date: {
        type: Date,
        default: Date.now,
    },
    is_client:{
        type: Boolean,
        default: false
    },
    is_subscribed:{
        type: Boolean,
        default: false
    },
    is_restricted: {
        type: Boolean,
        default: false
    },
    is_blocked: {
        type: Boolean,
        default: false
    }
    

})

// Methods
userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJwt = function () {
    return jwt.sign({ 
        _id: this._id,
        username: this.username
    },
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}

module.exports = mongoose.model('User',userSchema);