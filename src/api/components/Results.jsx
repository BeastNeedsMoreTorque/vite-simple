import React from 'react';
import PropTypes from 'prop-types';

const Results = (props) => {
  return (
    <section className="overflow-x-auto">
      <h1 className="font-bold m-3 p-3 text-center">Results</h1>
      <table className="font-medium m-3 p-3 table table-zebra">
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
              {match.homeTeam === 'West Ham United FC' ? (
                <td className="text-fuchsia-800 text-right text-xl font-extrabold">
                  {match.homeTeam}
                </td>
              ) : (
                <td className="p1 text-right">{match.homeTeam}</td>
              )}
              <td>{match.homeScore}</td>
              <td>{match.awayScore}</td>
              {match.awayTeam === 'West Ham United FC' ? (
                <td className="text-fuchsia-800 text-right text-xl font-extrabold">
                  {match.awayTeam}
                </td>
              ) : (
                <td className="p1 text-right">{match.awayTeam}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

Results.propTypes = {};

export default Results;
