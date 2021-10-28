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

    
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
      }
    
    type Query {
        users: [User]
        books: [Book]
    }


`;

module.exports = typeDefs;