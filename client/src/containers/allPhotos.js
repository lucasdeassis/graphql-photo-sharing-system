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
    }
`;

export const NEW_PHOTO_SUBSCRIPTION = gql`
  subscription {
    photoAdded {
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
            subscribeToNewPhotos={() => subscribeToMore({
              document: NEW_PHOTO_SUBSCRIPTION,
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
          />
        );
      }
    }
  </Query>
);

export default AllPhotos;
