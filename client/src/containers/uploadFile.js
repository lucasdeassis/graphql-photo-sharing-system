import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

export const UPLOAD_FILE = gql`
 mutation UploadPhoto($file: Upload!, $caption: String, $isPrivate: Boolean) {
    uploadPhoto(file: $file, caption: $caption, isPrivate: $isPrivate) {
      id
    }
  }
`;

export default () => (
    <Mutation mutation={UPLOAD_FILE}>
        {uploadPhoto => (
            <input
                type="file"
                required
                onChange={({ target: { validity, files: [file] } }) =>
                    validity.valid && uploadPhoto({ variables: { file, caption: 'Test File', isPrivate: true } })
                }
            />
        )}
    </Mutation>
);
