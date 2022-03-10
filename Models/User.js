// username, email, thoughts, friend
const { Schema, model } = require('mongoose');
const moment = require('moment');

// User schema
const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [ //regular expression for email here,
            'Please enter a valid email address']
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});

UserSchema.virtual('friendCount').get(function(){
    return this.friends.length;
});

// create User model using UserSchema
const User = model('User', UserSchema);

// export model
module.exports = User;