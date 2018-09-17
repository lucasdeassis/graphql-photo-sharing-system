import React from 'react';
import AllPhotos from './containers/allPhotos';
import UploadPhoto from './containers/uploadPhoto';
import './App.css';

const App = () => (
  <div className="App">
    <header className="App-header">
      <h1 className="App-title">Welcome to Instasham</h1>
    </header>
    <AllPhotos />
    <UploadPhoto />
  </div>
);

export default App;
