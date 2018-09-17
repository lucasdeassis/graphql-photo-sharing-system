import React from 'react';
import PropTypes from 'prop-types';
import Photo from './Photo';

export class PhotoList extends React.Component {
  componentDidMount() {
    this.props.subscribeToNewPhotos();
  }

  render() {
    const { data } = this.props;

    return (
      <div className="PhotoList">
        {data.photos.map(photo => <Photo key={photo.id} id={photo.id} width={photo.width} height={photo.height} />)}
      </div>
    );
  }
}

PhotoList.propTypes = {
  data: PropTypes.shape({
    photos: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      width: PropTypes.number,
      height: PropTypes.number,
    })),
  }),
  subscribeToNewPhotos: PropTypes.func.isRequired,
};

PhotoList.defaultProps = {
  data: {},
};


export default PhotoList;
