import React, { useCallback, useState } from 'react';

class ProfileSideCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data } = this.props;
    if (data) {
      return (
        <div className="profile-info">

          <div className="profile-img">
            <img src="{data.img}" alt="profile" />
          </div>

          <div className="profile-userinfo">
            <h3>{data.name}</h3>
            <span className="sub-header">{data.role}</span>
            <div className="user-data">
              <i className="fas fa-envelope" />
              {data.email}
            </div>
          </div>
          <form className="new-card-form">
            <input type="submit" value="Editar" />
          </form>

        </div>
      );
    }

    return (
      <div className="profile-info" />

    );
  }
}

export default ProfileSideCard;
