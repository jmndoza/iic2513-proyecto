/* eslint-disable react/prop-types */
import React, { useCallback } from 'react';
import { hot } from 'react-hot-loader';

function University(props) {
  const {
    setStatus, setNeedsUpdate, accessToken, data: { id, links, attributes: { code, name, domain } },
  } = props;
  const deleteHandler = useCallback(async () => {
    const response = await fetch(links.self, { method: 'DELETE', headers: { accessToken } });
    if (response.ok) {
      setStatus('University Deleted');
      setNeedsUpdate(true);
    } else {
      const error = await response.text();
      setStatus(`${response.status}, ${response.statusText}, ${error}`);
    }
  });

  const deleteButton = <button type="button" onClick={deleteHandler}>Delete</button>;
  return (
    <div>
      {`${id}, ${code}, ${name}, ${domain} `}
      {deleteButton}
    </div>
  );
}

export default hot(module)(University);
