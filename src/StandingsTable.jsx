/*
import React from 'react'

function StandingsTable() {


    // Sample match results data
// const matchResults = [
//     { homeTeam: 'TeamA', awayTeam: 'TeamB', homeScore: 2, awayScore: 1 },
//     { homeTeam: 'TeamC', awayTeam: 'TeamA', homeScore: 0, awayScore: 3 },
//     // ... more match results
//   ];
  
  // Step 1: Create initial standings
  const initialStandings = {};
  matchResults.forEach(match => {
    initialStandings[match.homeTeam] = { points: 0, goalsScored: 0, goalsConceded: 0 };
    initialStandings[match.awayTeam] = { points: 0, goalsScored: 0, goalsConceded: 0 };
  });
  
  // Step 2: Calculate standings
  const updatedStandings = matchResults.reduce((standings, match) => {
    const { homeTeam, awayTeam, homeScore, awayScore } = match;
    
    standings[homeTeam].goalsScored += homeScore;
    standings[homeTeam].goalsConceded += awayScore;
    standings[awayTeam].goalsScored += awayScore;
    standings[awayTeam].goalsConceded += homeScore;
  
    if (homeScore > awayScore) {
      standings[homeTeam].points += 3;
    } else if (homeScore < awayScore) {
      standings[awayTeam].points += 3;
    } else {
      standings[homeTeam].points += 1;
      standings[awayTeam].points += 1;
    }
  
    return standings;
  }, { ...initialStandings });
  
  // Step 3: Sort standings
  const sortedStandings = Object.keys(updatedStandings)
    .map(team => ({ team, ...updatedStandings[team] }))
    .sort((a, b) => b.points - a.points || (b.goalsScored - b.goalsConceded) - (a.goalsScored - a.goalsConceded));
  
  // Step 4: Render standings using React.js
  // function StandingsTable() {
    return (
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th>Points</th>
            <th>Goals Scored</th>
            <th>Goals Conceded</th>
          </tr>
        </thead>
        <tbody>
          {sortedStandings.map((teamData, index) => (
            <tr key={index}>
              <td>{teamData.team}</td>
              <td>{teamData.points}</td>
              <td>{teamData.goalsScored}</td>
              <td>{teamData.goalsConceded}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  //}
}

export default StandingsTable

*/