import React, { useCallback, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
  }

  getData() {
    axios.get('http://localhost:3000/dashboard')
      .then((res) => {
        console.log(res.data);
        this.setState({ data: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  render() {
    return (
      <h3>Dashboard react</h3>
    );
  }
}

export default Dashboard;
