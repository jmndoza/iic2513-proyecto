/* eslint-disable react/prop-types */
import React, { useCallback, useState, useEffect } from 'react';
import { hot } from 'react-hot-loader';
import List from './List';
import University from './University';

function UniversityList(props) {
  const { accessToken } = props;
  const [universities, setUniversities] = useState([]);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const fetchUniveristies = useCallback(async () => {
    const response = await fetch('/api/universities').then((resp) => resp.json());
    setUniversities(response.data);
    setNeedsUpdate(false);
  });

  useEffect(() => { fetchUniveristies(); }, [needsUpdate]);

  return (
    <List
      data={universities}
      Container={University}
      setNeedsUpdate={setNeedsUpdate}
      accessToken={accessToken}
    />
  );
}

export default hot(module)(UniversityList);
