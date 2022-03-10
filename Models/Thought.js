const { Schema, model } = require('mongoose');
const moment = require('moment');


// Thought schema
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: 'Need a message.',        
            minlength: 1, 
            maxlength: 280
        },
        createdAt:{
            type: Date,
            default: Date.now
            // get
        },
        username: {
            type: String,
            required: true, 
            ref: 'User'
        },
        reactions: [ReactionSchema],        
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

// Reaction schema to be added to Thought model as a subdocument.
const ReactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: true,
    },
    username: {
        type: String, 
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => moment(createdAtVal).format('MM DD, YYY [at] hh: mm a')
    }
},
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);


// get total count of thoughts on retrieval
ThoughtSchema.virtual('reactionCount').get(function(){
    return this.reactions.length;
});

// create Thought model using the ThoughtSchema
const Thought = model('Thought', ThoughtSchema);

// export model
module.exports = Thought;