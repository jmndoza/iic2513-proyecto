import React, { useState } from 'react';
import { hot } from 'react-hot-loader';
import Auth from './auth';
import UniversityList from './UniversityList';

function ApiApplication() {
  const [accessToken, setAccessToken] = useState('invalid');

  return (
    <div>
      <Auth setAccessToken={setAccessToken} />
      <UniversityList accessToken={accessToken} />
    </div>
  );
}

export default hot(module)(ApiApplication);
