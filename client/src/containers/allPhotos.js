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

export const PHOTO_SUBSCRIPTION = trigger => gql`
  subscription {
    ${trigger} {
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
              document: PHOTO_SUBSCRIPTION('photoDeleted'),
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;

                return {
                  photos: [
                    ...prev.messages,
                    subscriptionData.data.photoAdded,
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
