import React, { useCallback, useState } from 'react';
import { hot } from 'react-hot-loader';
import Card from './card';
function ProfileCard() {
  // const [currentValue, setCurrentValue] = useState(0);
  // const incrementValue = useCallback(() => setCurrentValue(currentValue + 1));
  // const decrementValue = useCallback(() => setCurrentValue(currentValue - 1));
  // console.log(`inside component function, counter: ${currentValue}`);

  return (
    <div>
      <div className="profile-rightcontent">
        <Card />

      </div>
    </div>
  );
}

export default hot(module)(ProfileCard);