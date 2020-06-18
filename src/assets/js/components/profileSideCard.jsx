import React, { useCallback, useState } from 'react';
import { hot } from 'react-hot-loader';

function ProfileSideCard() {
  // const [currentValue, setCurrentValue] = useState(0);
  // const incrementValue = useCallback(() => setCurrentValue(currentValue + 1));
  // const decrementValue = useCallback(() => setCurrentValue(currentValue - 1));
  // console.log(`inside component function, counter: ${currentValue}`);

  return (
    <div className="profile-info">

      <div className="profile-img">
        <img src="https://cdn1.vectorstock.com/i/thumb-large/77/30/default-avatar-profile-icon-grey-photo-placeholder-vector-17317730.jpg" alt="profile" />
      </div>

      <div className="profile-userinfo">
        <h3>profile name</h3>
        <span className="sub-header">role</span>
        <div className="user-data">
          <i className="fas fa-envelope" />
          email@email.com
        </div>
      </div>
      <form className="new-card-form">
        <input type="submit" value="Editar" />
      </form>

    </div>
  );
}

export default hot(module)(ProfileSideCard);
