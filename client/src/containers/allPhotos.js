import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { PhotoList } from '../components/PhotoList';

export const GET_ALL_PHOTOS = gql`
    query getAllPhotos {
        photos {
            id
            width
            height
        }
        me {
          id
          name
        }
    }
`;

export const ADD_PHOTO_SUBSCRIPTION = gql`
  subscription {
    photoAdded {
      id
      width,
      height,
    }
  }
`;

export const DELETE_PHOTO_SUBSCRIPTION = gql`
  subscription {
    photoDeleted {
      id
      width,
      height,
    }
  }
`;

export const EDIT_PHOTO_SUBSCRIPTION = gql`
  subscription {
    photoEdited {
      id
      width,
      height,
    }
  }
`;

const AllPhotos = () => (
  <Query query={GET_ALL_PHOTOS}>
    {
      ({
        loading, error, data, subscribeToMore,
      }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error :(</div>;

        return (
          <PhotoList
            data={data}
            subscribeToAddedPhotos={() => subscribeToMore({
              document: ADD_PHOTO_SUBSCRIPTION,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;

                return {
                  photos: [
                    subscriptionData.data.photoAdded,
                    ...prev.photos,
                  ],
                };
              },
            })}

            subscribeToDeletedPhotos={() => subscribeToMore({
              document: DELETE_PHOTO_SUBSCRIPTION,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;

                const photos = [...prev.photos];
                const photoDeletedIndex =
                  photos.findIndex(value => value.id === subscriptionData.data.photoDeleted.id);
                photos.splice(photoDeletedIndex, 1);

                return {
                  photos,
                };
              },
            })}

            subscribeToEditedPhotos={() => subscribeToMore({
              document: EDIT_PHOTO_SUBSCRIPTION,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;

                const photos = [...prev.photos];
                const photoIndex =
                  prev.photos.findIndex(value => value.id === subscriptionData.data.photoEdited.id);
                photos[photoIndex] = subscriptionData.data.photoEdited;

                return {
                  photos,
                };
              },
            })}
          />
        );
      }
    }
  </Query>
);

export default AllPhotos;
