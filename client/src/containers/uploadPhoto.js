import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

export const UPLOAD_PHOTO = gql`
 mutation UploadPhoto($image: Upload!, $caption: String, $private: Boolean) {
    uploadPhoto(image: $image, caption: $caption, private: $private) {
      id
    }
  }
`;

export default () => (
  <Mutation mutation={UPLOAD_PHOTO}>
    {uploadPhoto => (
      <input
        type="file"
        accept="image/x-png,image/jpeg"
        required
        onChange={({ target: { validity, files: [image] } }) =>
          validity.valid && uploadPhoto({ variables: { image, caption: 'Test File', private: true } })
        }
      />
    )}
  </Mutation>
);
