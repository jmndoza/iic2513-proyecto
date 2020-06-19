import React, { useCallback, useState } from 'react';
import { hot } from 'react-hot-loader';

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data, baseURL } = this.props;
    const deleteURI = `${baseURL}/evaluations/${data.id}/`;
    const editURI = `${baseURL}/evaluations/${data.id}/edit`;
    return (
      <div className="new-card">

        <div className="rightside-card">
          <div className="new-card-title">{data.Course.name}</div>
          <span className="date">{data.createdAt}</span>
          <p className="quote">{data.comment}</p>
          <div className="new-card-buttons">
            <div />
            <form action={editURI} method="get" className="new-card-form">
              <input type="submit" value="Edit" />
            </form>
            <form action={deleteURI} method="post" className="new-card-form">
              <input type="hidden" name="_method" value="delete" />
              <input type="submit" value="Delete" />
            </form>

          </div>
        </div>

        <div className="leftside-card">
          <div className="profesor-name">{data.ProfessorName.name}</div>
          <div className="semester"> {data.year}-{data.semester}</div>

          <div className="time-rating rating">
            <i className="fas fa-user-clock" />
            time: {data.timeRating}
          </div>
          <div className="difficulty-rating rating">
            <i className="fas fa-user-cog" />
            difficulty: {data.difficultyRating}
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
