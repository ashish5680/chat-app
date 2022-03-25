const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({

    // passport local mongoose username and password(hash and salt) apne aap manage kar lega, so no need to write that

    email: {
        type: String,
        require: true,
        unique:true,
        trim: true
    }

});


userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;