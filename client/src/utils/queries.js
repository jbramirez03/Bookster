import { gql } from '@apollo/client';

// Created query for me that returns all the available fields from the user typeDef.
export const QUERY_ME = gql`

    query me {
        me {
            _id
            username
            email
            bookCount
            savedBooks {
                #_id
                bookId
                authors
                description
                title
                link
                image
            }
        }
    }

`;