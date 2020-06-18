import React, { useCallback, useState } from 'react';
import { hot } from 'react-hot-loader';
import ProfileCard from '../components/profileCard';
import ProfileSideCard from '../components/profileSideCard';

function ProfileAccount() {
  // const [currentValue, setCurrentValue] = useState(0);
  // const incrementValue = useCallback(() => setCurrentValue(currentValue + 1));
  // const decrementValue = useCallback(() => setCurrentValue(currentValue - 1));
  // console.log(`inside component function, counter: ${currentValue}`);

  return (

    <div id="profile" className="profile">
      <ProfileSideCard />
      <ProfileCard />
    </div>

  );
}

export default hot(module)(ProfileAccount);
