const { Thought, User } = require('../models');

const thoughtController = {
    //get all thoughts
 
        getAllThoughts(req, res) {
            Thought.find({})
            .select('-__v')
            .sort({_id: -1})
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
        },
    //get one thought by ID
      getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({message: 'No Thought found with this id!'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },
    // make/create Thought
    createThought({ params, body }, res) {
        Thought.create(body)
            .then(({ _id}) => {
                return User.findOneAndUpdate(
                    { username: body.username },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this username'});
                return;               
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },


    //update thoughts per ID
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true, runValidators: true }
        )
        .then(updatedThought => {
            if (!updatedThought) {
                return res.status(404).json({ message: 'No thought with this id'});                
            }
        res.json(updatedThought);
        })
        .catch(err => res.json(err));
    },

    deleteThought({ params, body}, res) {
        Thought.findByIdAndDelete({ _id: params.id})
        .then(deletedThought => {
            if (!deletedThought) {
                return res.status(404).json({ message: 'No thought with this id'})
            }
            res.json(deletedThought);
        })
        .catch(err => res.json(err));
    },

        // add reaction here
        addReaction ({ params, body}, res) {
            Thought.findByIdAndUpdate(
                { _id: params.thoughtId },
                { $push: { reactions: body } },
                { new: true, runValidators: true }
            )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought with this id'});
                    return;
                }
                res.json(dbThoughtData)
            })
            .catch(err => res.json(err));
        },
    
        //delete Reaction
        deleteReaction({ params, body }, res) {
            Thought.findOneAndUpdate(
                { _id: params.thoughtId },
                { $pull: { reactions: { reactionId: body.reactionId } } },
                { new: true, runValidators: true }
            )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id' });
                    return;
                }
                res.json({message: 'Successfully deleted the reaction'});
            })
            .catch(err => res.status(500).json(err));
        },
};

module.exports = thoughtController;