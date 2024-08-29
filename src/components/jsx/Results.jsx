import React from 'react';
import PropTypes from 'prop-types';

const Results = ({ matchResults }) => {
  const isWestHam = (team) => team === 'West Ham United FC';

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
          {matchResults.map((match, index) => (
            <tr key={index}>
              <td className='text-center'>{match.date}</td>
              <td className='text-center'>{match.time}</td>
              <td className={`text-right ${isWestHam(match.homeTeam) ? 'text-fuchsia-800 font-extrabold' : 'p1'}`}>
                {match.homeTeam}
              </td>
              <td className='text-center'>{match.homeScore}</td>
              <td className='text-center'>{match.awayScore}</td>
              <td className={`text-left ${isWestHam(match.awayTeam) ? 'text-fuchsia-800 font-extrabold' : 'p1'}`}>
                {match.awayTeam}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

Results.propTypes = {
  matchResults: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    homeTeam: PropTypes.string.isRequired,
    awayTeam: PropTypes.string.isRequired,
    homeScore: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    awayScore: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  })).isRequired,
};

export default Results;
