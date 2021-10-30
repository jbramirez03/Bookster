import { gql } from '@apollo/client';

// Created mutations with variables being passed in through to the mutations defined in the typeDefs file.
export const ADD_USER = gql`

mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password){
        token
        user {
        _id
        username
      }
    }

}

`;

export const LOGIN = gql`

mutation login($email: String!, $password: String!){
    login(email: $email, password: $password){
        token
        user {
            _id
        }
    }
}

`;


export const SAVE_BOOK = gql`

mutation saveBook($input: savedBook!){
    saveBook(input: $input) {
        _id
        username
        bookCount
        email
        savedBooks {
            #_id
            bookId
            authors
            link
            image
            description
            title
        }
        }
}

`;


export const REMOVE_BOOK = gql`

mutation removeBook($bookId: ID!){
    removeBook(bookId: $bookId){
        _id
        username
        email
        bookCount
        savedBooks {
            #_id
            bookId
            authors
            description
            image
            link
            title
        }
    }
}

`;