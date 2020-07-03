/* eslint-disable no-console */
import React from 'react';
import axios from 'axios';
import ProfileSideCard from '../components/profileSideCard';
import Card from '../components/card';

const renderCards = (items) => {
  const cards = items.map((info) => <Card key={info.id} data={info} />);
  return (
    <div className="profile-rightcontent">
      { cards }
    </div>
  );
};

class ProfileAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    this.setUser();
  }

  setUser() {
    axios.get('/users/profile')
      .then((res) => {
        console.log(res.data);
        this.setState({ data: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { data } = this.state;
    if (data) {
      return (
        <div id="profile" className="profile">
          <ProfileSideCard data={data.currentUser} />
          {renderCards(data.evaluationList)}
        </div>
      );
    }
    return (
      <div id="profile" className="profile" />
    );
  }
}

export default ProfileAccount;
