const calcStandings5 = (matchResults) => {
  const standings = Object.create(null);

  const updateTeamStandings = (team, score, opponentScore, crest, result) => {
    if (!standings[team]) {
      standings[team] = { team, crest, gp: 0, goalsScored: 0, goalsConceded: 0, points: 0, form: '', wins: 0, draws: 0, losses: 0 };
    }
    const s = standings[team];
    s.gp++;
    s.goalsScored += score;
    s.goalsConceded += opponentScore;
    s.points += result === 'w' ? 3 : result === 'd' ? 1 : 0;
    s.form = s.form.slice(-4) + result;
    s[result === 'w' ? 'wins' : result === 'd' ? 'draws' : 'losses']++;
  };

  matchResults.forEach(({ homeTeam, awayTeam, homeScore, awayScore, homeCrest, awayCrest }) => {
    const homeResult = homeScore > awayScore ? 'w' : homeScore < awayScore ? 'l' : 'd';
    const awayResult = homeResult === 'w' ? 'l' : homeResult === 'l' ? 'w' : 'd';

    updateTeamStandings(homeTeam, homeScore, awayScore, homeCrest, homeResult);
    updateTeamStandings(awayTeam, awayScore, homeScore, awayCrest, awayResult);
  });

  return Object.values(standings)
    .map(team => {
      team.goalDifference = team.goalsScored - team.goalsConceded;
      return team;
    })
    .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference);
};

export default calcStandings5;

// Previous code (commented out):
/*
import _ from 'lodash';

const calcStandings5 = (matchResults) => {
  const standings = {};

  matchResults.forEach((match) => {
    const { date, time, homeTeam, awayTeam, homeScore, awayScore, homeCrest, awayCrest } = match;

    // Determine the result of the match for each team
    const homeResult = _.cond([
      [_.gt, _.constant('w')],
      [_.lt, _.constant('l')],
      [_.stubTrue, _.constant('d')],
    ])(homeScore, awayScore);

    const awayResult = _.cond([
      [_.gt, _.constant('l')],
      [_.lt, _.constant('w')],
      [_.stubTrue, _.constant('d')],
    ])(homeScore, awayScore);

    // Update standings for the home team
    standings[homeTeam] = {
      ...standings[homeTeam],
      crest: homeCrest,
      gp: (standings[homeTeam]?.gp || 0) + 1,
      goalsScored: (standings[homeTeam]?.goalsScored || 0) + homeScore,
      goalsConceded: (standings[homeTeam]?.goalsConceded || 0) + awayScore,
      points:
        (standings[homeTeam]?.points || 0) +
        (homeScore > awayScore ? 3 : homeScore === awayScore ? 1 : 0),
      form: (standings[homeTeam]?.form || '') + homeResult,
      wins: (standings[homeTeam]?.wins || 0) + (homeResult === 'w' ? 1 : 0),
      draws: (standings[homeTeam]?.draws || 0) + (homeResult === 'd' ? 1 : 0),
      losses: (standings[homeTeam]?.losses || 0) + (homeResult === 'l' ? 1 : 0),
    };

    // Update standings for the away team
    standings[awayTeam] = {
      ...standings[awayTeam],
      crest: awayCrest,
      gp: (standings[awayTeam]?.gp || 0) + 1,
      goalsScored: (standings[awayTeam]?.goalsScored || 0) + awayScore,
      goalsConceded: (standings[awayTeam]?.goalsConceded || 0) + homeScore,
      points:
        (standings[awayTeam]?.points || 0) +
        (awayScore > homeScore ? 3 : awayScore === homeScore ? 1 : 0),
      form: (standings[awayTeam]?.form || '') + awayResult,
      wins: (standings[awayTeam]?.wins || 0) + (awayResult === 'w' ? 1 : 0),
      draws: (standings[awayTeam]?.draws || 0) + (awayResult === 'd' ? 1 : 0),
      losses: (standings[awayTeam]?.losses || 0) + (awayResult === 'l' ? 1 : 0),
    };
  });

  const sortedStandings = Object.keys(standings)
    .map((team) => ({ team, ...standings[team] }))
    .sort(
      (a, b) =>
        b.points - a.points || b.goalsScored - b.goalsConceded - (a.goalsScored - a.goalsConceded),
    );

  return sortedStandings;
};
*/
