import React, { useState } from 'react';
import { hot } from 'react-hot-loader';
import Auth from './auth';
import UniversityList from './UniversityList';
import CreateUniversity from './CreateUniversity';

function ApiApplication() {
  const [accessToken, setAccessToken] = useState('invalid');
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [status, setStatus] = useState('');

  return (
    <div>
      <Auth
        setAccessToken={setAccessToken}
        setStatus={setStatus}
      />
      <h3>List of Universites</h3>
      <UniversityList
        accessToken={accessToken}
        setNeedsUpdate={setNeedsUpdate}
        needsUpdate={needsUpdate}
        setStatus={setStatus}
      />
      <CreateUniversity
        accessToken={accessToken}
        setNeedsUpdate={setNeedsUpdate}
        setStatus={setStatus}
      />
      <h3>Status</h3>
      <div>
        {status}
      </div>
    </div>
  );
}

export default hot(module)(ApiApplication);
