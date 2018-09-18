import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';

export const EDIT_PHOTO = gql`
 mutation EditPhoto($id: ID!, $caption: String, $private: Boolean) {
    editPhoto(id: $id, caption: $caption, private: $private){
      id
      width
      height
      caption
      private
    }
  }
`;

class EditPhotoMutation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      caption: props.caption,
      private: props.private,
    };

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange({ target }) {
    this.setState({
      [target.name]: target.name === 'private' ? target.checked : target.value,
    });
  }

  render() {
    const { id } = this.props;
    const { caption, private: isPrivate } = this.state;

    return (
      <Mutation mutation={EDIT_PHOTO}>
        {editPhoto => (
          <div>
            <div>
              <label htmlFor="caption"> caption: </label>
              <input value={caption} id="caption" name="caption" onChange={this.handleOnChange} />
            </div>
            <div>
              <label htmlFor="private"> private: </label>
              <input type="checkbox" id="private" name="private" onChange={this.handleOnChange} defaultChecked={isPrivate} />
            </div>
            <button onClick={() => editPhoto({ variables: { id, caption, private: isPrivate } })}>
              Edit
            </button>
          </div>
        )}
      </Mutation>
    );
  }
}

EditPhotoMutation.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  caption: PropTypes.string.isRequired,
  private: PropTypes.bool.isRequired,
};

export default EditPhotoMutation;
