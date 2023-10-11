//Functional version of the code, where the assignment with the += operator is
//replaced with object spread and ternary conditional operators.
/*
const calcStandings4 = (matchResults) => {
    const standings = {};

    matchResults.forEach(match => {
        const { homeTeam, awayTeam, homeScore, awayScore, homeCrest, awayCrest } = match;
        
        standings[homeTeam] = {
            ...standings[homeTeam],
            crest: homeCrest,
            gp: (standings[homeTeam]?.gp || 0) + 1,
            goalsScored: (standings[homeTeam]?.goalsScored || 0) + homeScore,
            goalsConceded: (standings[homeTeam]?.goalsConceded || 0) + awayScore,
            points: (standings[homeTeam]?.points || 0) + (homeScore > awayScore ? 3 : homeScore === awayScore ? 1 : 0),
        };

        standings[awayTeam] = {
            ...standings[awayTeam],
            crest: awayCrest,
            gp: (standings[awayTeam]?.gp || 0) + 1,
            goalsScored: (standings[awayTeam]?.goalsScored || 0) + awayScore,
            goalsConceded: (standings[awayTeam]?.goalsConceded || 0) + homeScore,
            points: (standings[awayTeam]?.points || 0) + (awayScore > homeScore ? 3 : awayScore === homeScore ? 1 : 0),
        };
    });

    const sortedStandings = Object.keys(standings)
        .map(team => ({ team, ...standings[team] }))
        .sort((a, b) => b.points - a.points || (b.goalsScored - b.goalsConceded) - (a.goalsScored - a.goalsConceded));

    return sortedStandings;
};

export default calcStandings4;
*/

import _ from 'lodash';

const calcStandings4 = (matchResults) => {
  const standings = {};

  matchResults.forEach((match) => {
    const { homeTeam, awayTeam, homeScore, awayScore, homeCrest, awayCrest } =
      match;

    // determine the result of the match for each team
    // let homeResult, awayResult;
    // if (homeScore > awayScore) {
    //     homeResult = 'w';
    //     awayResult = 'l';
    // } else if (homeScore < awayScore) {
    //     homeResult = 'l';
    //     awayResult = 'w';
    // } else {
    //     homeResult = 'd';
    //     awayResult = 'd';
    // }

    // determine the result of the match for each team (using lodash)
    const homeResult = _.cond([
      [_.gt, _.constant("w")], // if homeScore > awayScore, return 'w'
      [_.lt, _.constant("l")], // if homeScore < awayScore, return 'l'
      [_.stubTrue, _.constant("d")], // otherwise, return 'd'
    ])(homeScore, awayScore); // apply the function to homeScore and awayScore

    const awayResult = _.cond([
      [_.gt, _.constant("l")], // if homeScore > awayScore, return 'l'
      [_.lt, _.constant("w")], // if homeScore < awayScore, return 'w'
      [_.stubTrue, _.constant("d")], // otherwise, return 'd'
    ])(homeScore, awayScore); // apply the function to homeScore and awayScore

    standings[homeTeam] = {
      ...standings[homeTeam],
      crest: homeCrest,
      gp: (standings[homeTeam]?.gp || 0) + 1,
      goalsScored: (standings[homeTeam]?.goalsScored || 0) + homeScore,
      goalsConceded: (standings[homeTeam]?.goalsConceded || 0) + awayScore,
      points:
        (standings[homeTeam]?.points || 0) +
        (homeScore > awayScore ? 3 : homeScore === awayScore ? 1 : 0),
      // append the result to the form attribute or create a new one if it does not exist
      form: (standings[homeTeam]?.form || "") + homeResult,
    };

    standings[awayTeam] = {
      ...standings[awayTeam],
      crest: awayCrest,
      gp: (standings[awayTeam]?.gp || 0) + 1,
      goalsScored: (standings[awayTeam]?.goalsScored || 0) + awayScore,
      goalsConceded: (standings[awayTeam]?.goalsConceded || 0) + homeScore,
      points:
        (standings[awayTeam]?.points || 0) +
        (awayScore > homeScore ? 3 : awayScore === homeScore ? 1 : 0),
      // append the result to the form attribute or create a new one if it does not exist
      form: (standings[awayTeam]?.form || "") + awayResult,
    };
  });

  const sortedStandings = Object.keys(standings)
    .map((team) => ({ team, ...standings[team] }))
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalsScored - b.goalsConceded - (a.goalsScored - a.goalsConceded)
    );

  return sortedStandings;
};

export default calcStandings4;