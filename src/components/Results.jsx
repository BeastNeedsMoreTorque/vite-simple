import React from 'react';
import PropTypes from 'prop-types';

const Results = (props) => {
  return (
    <section className="m-3 p-3 overflow-x-auto">
      <h1 className="font-bold m-3 p-3 text-center">Results</h1>
      <table className="font-medium m-3 p-3 table table-zebra">
        <thead>
          <tr>
            <th className='text-center'>Date</th>
            <th className='text-center'>Time</th>
            <th className="text-right">Home</th>
            <th></th>
            <th></th>
            <th>Away</th>
          </tr>
        </thead>
        <tbody>
          {props.matchResults.map((match, index) => (
            <tr key={index}>
              <td className='text-center'>{match.date}</td>
              <td className='text-center'>{match.time}</td>
              {match.homeTeam === 'West Ham United FC' ? (
                <td className="text-fuchsia-800 text-right font-extrabold">
                  {match.homeTeam}
                </td>
              ) : (
                <td className="p1 text-right">{match.homeTeam}</td>
              )}
              <td className='text-center'>{match.homeScore}</td>
              <td className='text-center'>{match.awayScore}</td>
              {match.awayTeam === 'West Ham United FC' ? (
                <td className="text-fuchsia-800 text-left font-extrabold">
                  {match.awayTeam}
                </td>
              ) : (
                <td className="p1 text-left">{match.awayTeam}</td>
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
