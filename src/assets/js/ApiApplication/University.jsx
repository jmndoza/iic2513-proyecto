/* eslint-disable react/prop-types */
import React, { useCallback } from 'react';
import { hot } from 'react-hot-loader';

function University(props) {
  const {
    setNeedsUpdate, accessToken, data: { id, links, attributes: { code, name, domain } },
  } = props;
  const deleteHandler = useCallback(async () => {
    await fetch(links.delete, { method: 'DELETE', headers: { accessToken } });
    setNeedsUpdate(true);
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
