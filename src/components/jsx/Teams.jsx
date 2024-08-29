//curl -X GET http://api.football-data.org/v4/teams/759/matches
//dateFrom={DATE}
// dateTo={DATE}
// season={YEAR}
// competitions={competitionIds}
// status={STATUS}
// venue={VENUE}
// limit={LIMIT}
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { getTeam } from '../../api/config';

function Teams(props) {
  const [teamMatches, setTeamMatches] = useState([]);

  const fetchTeamMatches = useCallback(async () => {
    try {
      const teamId = 563; // Consider making this a prop or state
      const season = 2024; // Consider making this a prop or state
      const response = await getTeam(teamId, season);
      const results = response.data.matches;
      setTeamMatches(results);
    } catch (error) {
      console.error('Error fetching team matches:', error);
      // Consider setting an error state here
    }
  }, []);

  useEffect(() => {
    fetchTeamMatches();
  }, [fetchTeamMatches]);

  console.log('team matches: ', teamMatches);

  return (
    <section>
      <table className="table table-zebra">
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>Home</th>
            <th></th>
            <th></th>
            <th></th>
            <th>Away</th>
          </tr>
        </thead>
        <tbody>
          {teamMatches.map((m, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td><img className='w-5 rounded-full' src={m.homeTeam.crest} alt="team-crest" /></td>
              <td className='text-right'>{m.homeTeam.name}</td>
              <td>{m.score.fullTime.home}</td>
              <td>{m.score.fullTime.away}</td>
              <td ><img className='w-5 rounded-full' src={m.awayTeam.crest} alt="team-crest" /></td>
              <td className='text-left'>{m.awayTeam.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

Teams.propTypes = {};

export default Teams;
