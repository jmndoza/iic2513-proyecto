import React, { useCallback, useState } from 'react';
import { hot } from 'react-hot-loader';

function Card() {
  // const [currentValue, setCurrentValue] = useState(0);
  // const incrementValue = useCallback(() => setCurrentValue(currentValue + 1));
  // const decrementValue = useCallback(() => setCurrentValue(currentValue - 1));
  // console.log(`inside component function, counter: ${currentValue}`);

  return (
    <div className="new-card">

      <div className="rightside-card">
        <div className="new-card-title">Titulo Tarjeta</div>
        <span className="date"> created at </span>
        <p className="quote"> esta muy bueno el ramo</p>
        <div className="new-card-buttons">
          <div />
          <form method="get" className="new-card-form">
            <input type="submit" value="Edit" />
          </form>
          <form method="post" className="new-card-form">
            <input type="hidden" name="_method" value="delete" />
            <input type="submit" value="Delete" />
          </form>

        </div>
      </div>

      <div className="leftside-card">
        <div className="profesor-name">name</div>
        <div className="semester">2020-1</div>

        <div className="time-rating rating">
          <i className="fas fa-user-clock" />
          time: 1
        </div>
        <div className="difficulty-rating rating">
          <i className="fas fa-user-cog" />
          difficulty: 2
        </div>
      </div>
    </div>
  );
}

export default hot(module)(Card);
