import React from 'react';
import ReactDOM from 'react-dom';
import ProfileAccount from './containers/profileAccount';
import Dashboard from './containers/dashboard';
import ApiApplication from './ApiApplication/ApiApplication';

const reacProfileContainer = document.getElementById('container-profile');
const reactDashboard = document.getElementById('container-dashboard');
const applicationDiv = document.getElementById('application-div');

if (reacProfileContainer) {
  ReactDOM.render(<ProfileAccount />, reacProfileContainer);
}

if (reactDashboard) {
  ReactDOM.render(<Dashboard />, reactDashboard);
}

if (applicationDiv) {
  ReactDOM.render(<ApiApplication />, applicationDiv);
}
