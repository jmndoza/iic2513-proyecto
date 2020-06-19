import React, { useCallback, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer,
} from 'recharts';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avgRating: null,
      professorRating: null,
      activity: null,
      universities: null,
      university: null,
      baseURL: 'http://localhost:3000',
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    this.getUniversities();
    this.getDataAvgRating();
    this.getDataProfessorRating();
    this.getActivity();
  }

  getUniversities() {
    axios.get(`${this.state.baseURL}/dashboard/universities`)
      .then((res) => {
        console.log(res.data);
        this.setState({ universities: res.data });
      });
  }

  getDataAvgRating() {
    axios.get(`${this.state.baseURL}/dashboard/courserating`)
      .then((res) => {
        const group = res.data.reduce((r, a) => {
          r[a.universityName] = [...r[a.universityName] || [], a];
          return r;
        }, {});
        // console.log(group);
        this.setState({ avgRating: group });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getDataProfessorRating() {
    axios.get(`${this.state.baseURL}/dashboard/professorrating`)
      .then((res) => {
        const group = res.data.reduce((r, a) => {
          r[a.universityName] = [...r[a.universityName] || [], a];
          return r;
        }, {});
        // console.log(group);
        this.setState({ professorRating: group });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getActivity() {
    axios.get(`${this.state.baseURL}/dashboard/activity`)
      .then((res) => {
        const group = res.data.reduce((r, a) => {
          r[a.universityName] = [...r[a.universityName] || [], a];
          return r;
        }, {});
        // console.log(group);
        this.setState({ activity: group });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleSelect(event) {
    console.log(event);
    console.log(event.target.value);
    this.setState({
      university: event.target.value,
    });
  }

  render() {
    const {
      avgRating, professorRating, activity, university, universities,
    } = this.state;

    const optionsUniversities = () => {
      if (universities) {
        return universities.map((u) => (
          <option value={u.universityName} key={u.universityId}>{u.universityName}</option>));
      }
      return <div />;
    };

    if (university && avgRating && professorRating && activity) {
      const avgRatingUniversity = avgRating[university];
      const professorRatingCourse = professorRating[university];
      const activityUniversity = activity[university];
      console.log(avgRatingUniversity);
      return (
        <div id="dashboard" className="dashboard">

          <div className="dashboard-info">
            {university}
          </div>
          <div className="dashboard-rightcontent">
            <div>
              <label>Choose a university:</label>
              <select name="universities" id="universities" onChange={this.handleSelect} value={university}>
                <option disabled selected> -- select an option -- </option>
                {optionsUniversities()}
              </select>

            </div>
            <h3>Average rankings by course: </h3>
            <div className="new-card-dashboard">
              <ResponsiveContainer>
                <BarChart
                  data={avgRatingUniversity}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="courseName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgTimeRating" fill="#8884d8" />
                  <Bar dataKey="avgDifficultyRating" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <h3>Average rankings by Professor: </h3>
            <div className="new-card-dashboard">
              <ResponsiveContainer>
                <BarChart
                  data={professorRatingCourse}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="profesorName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgTimeRating" fill="#8884d8" />
                  <Bar dataKey="avgDifficultyRating" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <h3>Daily activity: </h3>
            <div className="new-card-dashboard">
              <ResponsiveContainer>
                <LineChart
                  data={activityUniversity}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="createdAt" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="quantity" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      );
    }
    return (
      <div id="dashboard" className="dashboard">
        <div className="dashboard-info">
        </div>
        <div className="dashboard-rightcontent">
          <div>
            <label htmlFor="universities">Choose a university:</label>

            <select name="universities" id="universities" onChange={this.handleSelect} value={university}>
              <option disabled selected> -- select an option -- </option>
              {
                optionsUniversities()
              }
            </select>

          </div>
        </div>
      </div>

    );
  }
}

export default Dashboard;
