import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';

export const DELETE_PHOTO = gql`
 mutation DeletePhoto($id: ID!) {
    deletePhoto(id: $id)
  }
`;

const DeletePhotoMutation = ({ id }) => (
  <Mutation mutation={DELETE_PHOTO}>
    {deletePhoto => (
      <button onClick={() => deletePhoto({ variables: { id } })}>
        Delete
      </button>
    )}
  </Mutation>
);

DeletePhotoMutation.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default DeletePhotoMutation;
