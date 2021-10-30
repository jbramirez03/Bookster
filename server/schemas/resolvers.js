const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

// set resolvers in an object to have one export, distinguish the type of whats being resolved, example: Query.
const resolvers = {
    Query: {
        // if a user exists in the context/logged in, grab info for that particular user by grabbing user id from the context.
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select("-__v -password")
                    .populate("savedBooks");

                return userData;
            }
            // if user not logged in throw error indicating a user is not logged in.
            throw new AuthenticationError("Not logged in");
        },
    },

    Mutation: {
        // Create a user based on the arguments passed in the addUser mutation, once user is create create token based on user information.
        addUser: async (parent, args) => {
            try {
                const user = await User.create(args);

                const token = signToken(user);

                return { token, user };
            } catch (err) {
                console.log(err);
            }
        },

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError("Incorrect credentials");
            }
            // hook used in order to validate whether user's password is correct
            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError("Incorrect credentials");
            }
            // once a user is logged in they are assigned a new token
            const token = signToken(user);

            return { token, user };
        },

        // Save book is a user is logged in and return the updated data for that user.
        saveBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: args.input } },
                    { new: true, runValidators: true }
                );
                return updatedUser;
            }

            throw new AuthenticationError("You need to be logged in!");
        },

        // Remove book if a user is logged and return the new updated data.
        removeBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },

                    { $pull: { savedBooks: { bookId: args.bookId } } },

                    { new: true }
                );

                return updatedUser;
            }
            throw new AuthenticationError("Please login in!");
        },
    },
};

module.exports = resolvers;