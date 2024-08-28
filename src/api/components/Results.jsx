import React from 'react';
import PropTypes from 'prop-types';

const Results = (props) => {
  return (
    <section className="overflow-x-auto">
      <h1>Results</h1>
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th className="text-right">Home</th>
            <th></th>
            <th></th>
            <th>Away</th>
          </tr>
        </thead>
        <tbody>
          {props.matchResults.map((match, index) => (
            <tr key={index}>
              <td>{match.date}</td>
              <td>{match.time}</td>
              <td className="p1 text-right">{match.homeTeam}</td>
              <td>{match.homeScore}</td>
              <td>{match.awayScore}</td>
              <td>{match.awayTeam}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

Results.propTypes = {};

export default Results;
