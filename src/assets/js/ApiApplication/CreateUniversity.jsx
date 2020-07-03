/* eslint-disable react/prop-types */
import React, { useCallback, useState } from 'react';
import { hot } from 'react-hot-loader';

function CreateUniversity(props) {
  const { setNeedsUpdate, accessToken, setStatus } = props;
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');

  const handleCodeChange = useCallback((event) => setCode(event.target.value));
  const handleNameChange = useCallback((event) => setName(event.target.value));
  const handleDomainChange = useCallback((event) => setDomain(event.target.value));
  const handleSubmit = useCallback(async () => {
    if (!code.length) {
      setStatus('Code can not be empty');
      return;
    }
    if (!name.length) {
      setStatus('Name can not be empty');
      return;
    }
    if (!domain.length) {
      setStatus('Domain can not be empty');
      return;
    }
    const data = new FormData();
    data.append('code', code);
    data.append('name', name);
    data.append('domain', domain);
    let response = await fetch('/api/universities', {
      method: 'POST',
      headers: { accessToken },
      body: data,
    });
    if (response.ok) {
      response = await response.json();
      setNeedsUpdate(true);
      setStatus('University Created');
    } else {
      const error = await response.text();
      setStatus(`${response.status}, ${response.statusText}, ${error}`);
    }
  });

  return (
    <div>
      <h3>Create University</h3>
      <label htmlFor="code">
        Code:
        <input type="text" name="code" onChange={handleCodeChange} value={code} placeholder="code" />
      </label>
      <label htmlFor="name">
        Name:
        <input type="text" name="name" onChange={handleNameChange} value={name} placeholder="name" />
      </label>
      <label htmlFor="domain">
        Domain:
        <input type="text" name="domain" onChange={handleDomainChange} value={domain} placeholder="domain" />
      </label>
      <button type="button" onClick={handleSubmit}>Create</button>
    </div>
  );
}

export default hot(module)(CreateUniversity);
