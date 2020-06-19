import React from 'react';
import ReactDOM from 'react-dom';
import ProfileAccount from './containers/profileAccount';
import Dashboard from './containers/dashboard';

const reacProfileContainer = document.getElementById('container-profile');
const reactDashboard = document.getElementById('container-dashboard');

if (reacProfileContainer) {
  ReactDOM.render(<ProfileAccount />, reacProfileContainer);
}

if (reactDashboard) {
  ReactDOM.render(<Dashboard />, reactDashboard);
}