import React from 'react';
import { Jumbotron, Container, Button, Row } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { QUERY_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);
  const userData = data?.me || [];

  if (!userData?.username) {
    return <h3>You need to log in to view this page.</h3>;
  }

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId }
      });
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light jumbotron_background'>
        <Container>
          <h1 className='text-center'>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Container fluid>
          {userData.savedBooks.map((book) => {
            return (
              <Row key={book.bookId} className='flex-row mt-5 justify-content-center bg-light p-3'>
                {book.image ? <div>
                  <img src={book.image} alt={`The cover for ${book.title}`} />
                </div> : null}
                <div>
                  <h3>{book.title}</h3>
                  <p className='small'>Authors: {book.authors}</p>
                  <p>{book.description}</p>
                </div>
                <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                  Delete this Book!
                  </Button>
              </Row>
            );
          })}
        </Container>
      </Container>
    </>
  );
};

export default SavedBooks;
