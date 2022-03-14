const { User, Thought } = require('../models');

const userController = {
    getAllUsers(req, res) {
        User.find({})
        .select('-__v')
        .sort({_id: -1})
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },
    // get one User by Id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({message: 'No User found with this id!'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    // createUser
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err));
    },

        // Update User per ID
        updateUser({ params, body }, res) {
            User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
                .then(dbUserData  => {
                    if (!dbUserData) {
                        res.status(404).json({ message: 'No User found with this Id!'});
                        return;
                    }
                    res.json(dbUserData);
                })
                .catch(err => res.json(400).json(err));
        },
    // adding friend
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            {_id: params.userId},
            { $push: { friends: params.friendId } },
            { new: true, runValidators: true}
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },


    // Delete user and that user's thoughts
    deleteUser({ params }, res) {
        Thought.findOneAndDelete({ userId: params.id })
        .then(() => {
            User.findByIdAndDelete({ _id: params.id })
                .then(dbUserData => {
                    if (!dbUserData) {
                        res.status(404).json({ message: 'No user found with this id!'});
                        return;
                    }
                    res.json(dbUserData);
                });
        })
        .catch(err => res.json(err));
    },
    
    // delete/remove friend
  removeFriend({ params }, res) {
        // remove friendId from userId's friend list
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this userId' });
                return;
            }
            // remove userId from friendId's friend list
            User.findOneAndUpdate(
                { _id: params.friendId },
                { $pull: { friends: params.userId } },
                { new: true, runValidators: true }
            )
            .then(dbUserData2 => {
                if(!dbUserData2) {
                    res.status(404).json({ message: 'No user found with this friendId' })
                    return;
                }
                res.json({message: 'Successfully deleted the friend'});
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
    }
};

module.exports = userController;