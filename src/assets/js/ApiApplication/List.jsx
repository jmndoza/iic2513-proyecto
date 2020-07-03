/* eslint-disable react/prop-types */
import React from 'react';
import { hot } from 'react-hot-loader';

function List(props) {
  const {
    data, Container, setNeedsUpdate, accessToken, setStatus,
  } = props;
  const itemList = [];
  data.forEach((item) => {
    itemList.push(<Container
      key={item.id.toString()}
      data={item}
      setNeedsUpdate={setNeedsUpdate}
      accessToken={accessToken}
      setStatus={setStatus}
    />);
  });
  return (
    <div>
      {itemList}
    </div>
  );
}

export default hot(module)(List);
