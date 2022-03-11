const { User, Thought } = require('../models');

const userController = {
    getAllUser(req, res) {
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
                res.json(dbPizzaData);
            })
            .catch(err => res.json(400).json(err));
    },
    // Delete user and that user's thoughts
    deleteUser({ params }, res) {
        Thought.deleteMany({ userId: params.id })
        .then(() => {
            User.findByIdAndDelete({ userId: params.id })
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

};

// module.exports =