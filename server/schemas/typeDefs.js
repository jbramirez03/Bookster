const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Book {
        bookId: String!
        authors: [String!]
        description: String!
        image: String!
        link: String!
        title: String!
    }


`;

module.exports = typeDefs;