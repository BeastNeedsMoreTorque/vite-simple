import React, { useCallback, useEffect, useState } from 'react';
import { getTeam } from '../api/config';

interface Match {
  homeTeam: {
    name: string;
    crest: string;
  };
  awayTeam: {
    name: string;
    crest: string;
  };
  score: {
    fullTime: {
      home: number;
      away: number;
    };
  };
}

const Teams: React.FC = () => {
  const [teamMatches, setTeamMatches] = useState<Match[]>([]);

  const fetchTeamMatches = useCallback(async () => {
    try {
      const teamId = 563; // Consider making this a prop or state
      const season = 2024; // Consider making this a prop or state
      const response = await getTeam(teamId, season);
      const results: Match[] = response.data.matches;
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
        <h4>This is TSX</h4>
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
};

export default Teams;

/**
Key changes made:

1. Removed the `PropTypes` import as it's not needed in TypeScript.
2. Defined an interface `Match` to type the structure of each match in the `teamMatches` array.
3. Changed the function declaration to use an arrow function with `React.FC` type.
4. Added type annotation for the `teamMatches` state: `useState<Match[]>([])`.
5. Added type annotation for the `results` in the `fetchTeamMatches` function.
6. Removed the empty `Teams.propTypes` object as it's not needed in TypeScript.

The JSX part of the component remains unchanged, so I've omitted it for brevity. This conversion maintains the functionality while adding type safety to the component.
 */