import React from 'react';
import ReactDOM from 'react-dom';
import ProfileAccount from './containers/profileAccount';

const reacProfileContainer = document.getElementById('container-profile');

if (reacProfileContainer) {
  ReactDOM.render(<ProfileAccount />, reacProfileContainer);
}
