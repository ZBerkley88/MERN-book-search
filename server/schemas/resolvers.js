const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
    users: async () => {
      return User.find({});
    },
  },
  Mutation: {
    createUser: async (parent, args) => {
      const user = await User.create(args);
      return user;
    },
  },
  login: async (parent, { username, email, password }) => {
    const user = await User.create({ username, email, password });

    if (!profile) {
      throw new AuthenticationError("No user with this email found!");
    }

    const correctPw = await profile.isCorrectPassword(password);

    if (!correctPw) {
      throw new AuthenticationError("Incorrect password!");
    }

    const token = signToken(user);
    return { user, token };
  },
  saveBook: async (parent, { userId, book }) => {
    return User.findOneAndUpdate(
      { _id: userId },
      {
        $addToSet: { savedBooks: book },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  },
  removeBook: async (parent, { userId, book }) => {
    return User.findOneAndUpdate(
      { _id: userId },
      { $pull: { savedBooks: book }},
      { new: true }
    );
  },
};

module.exports = resolvers;
