/* eslint-disable react/prop-types */
import React, { useCallback, useState } from 'react';
import { hot } from 'react-hot-loader';

function Auth(props) {
  const { setStatus } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = useCallback((event) => setEmail(event.target.value));
  const handlePasswordChange = useCallback((event) => setPassword(event.target.value));
  const handleSubmit = useCallback(async () => {
    const data = new FormData();
    data.append('email', email);
    data.append('password', password);
    let response = await fetch('/api/auth', {
      method: 'POST',
      body: data,
    });
    if (response.ok) {
      response = await response.json();
      props.setAccessToken(response.accessToken);
      setStatus(`Authorized: ${response.accessToken}`);
    } else {
      const error = await response.text();
      setStatus(`${response.status}, ${response.statusText}, ${error}`);
    }
  });

  return (
    <div>
      <h3>Authorize</h3>
      <input className="api-input" type="email" name="email" onChange={handleEmailChange} value={email} placeholder="email" />
      <input className="api-input" type="password" name="password" onChange={handlePasswordChange} value={password} placeholder="password" />
      <button type="button" onClick={handleSubmit}>Authorize</button>
    </div>
  );
}

export default hot(module)(Auth);
