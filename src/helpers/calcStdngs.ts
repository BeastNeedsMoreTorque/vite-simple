interface MatchResult {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeCrest: string;
  awayCrest: string;
}

interface TeamStanding {
  team: string;
  crest: string;
  gp: number;
  goalsScored: number;
  goalsConceded: number;
  points: number;
  form: string;
  wins: number;
  draws: number;
  losses: number;
  goalDifference?: number;
}

const calcStdngs = (matchResults: MatchResult[]): TeamStanding[] => {
  const standings: Record<string, TeamStanding> = Object.create(null);

  const updateTeamStandings = (team: string, score: number, opponentScore: number, crest: string, result: 'w' | 'd' | 'l'): void => {
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

    updateTeamStandings(homeTeam, homeScore, awayScore, homeCrest, homeResult as 'w' | 'd' | 'l');
    updateTeamStandings(awayTeam, awayScore, homeScore, awayCrest, awayResult as 'w' | 'd' | 'l');
  });

  return Object.values(standings)
    .map(team => {
      team.goalDifference = team.goalsScored - team.goalsConceded;
      return team;
    })
    .sort((a, b) => b.points - a.points || b.goalDifference! - a.goalDifference!);
};

export default calcStdngs;

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

--more notes:
Certainly! I'll analyze the current implementation of `calcStdngs` function:

1. Type Safety: The code uses TypeScript interfaces (`MatchResult` and `TeamStanding`) to define the structure of input and output data, improving type safety and readability.

2. Efficiency: The function uses a single pass through the match results to calculate standings, which is efficient for large datasets.

3. Data Structure: It uses an object (`standings`) to store team data, allowing for quick updates and lookups.

4. Helper Function: The `updateTeamStandings` function encapsulates the logic for updating a team's statistics, promoting code reusability and readability.

5. Form Tracking: The code tracks the last 5 matches' form using a string, which is a compact representation.

6. Sorting: The final sorting considers both points and goal difference, which is a common approach in sports standings.

7. Immutability: The function doesn't modify the input data, instead creating a new standings object.

8. Null Object Pattern: `Object.create(null)` is used to create a "clean" object without inherited properties.

Compared to the previous implementation (commented out):

- The new version is more concise and easier to read.
- It doesn't rely on lodash, reducing dependencies.
- It's fully typed, which wasn't the case in the previous version.
- The logic for updating team standings is centralized in a helper function, whereas the old version repeated this logic for home and away teams.

Overall, the current implementation is well-structured, efficient, and type-safe. It's a significant improvement over the previous version in terms of readability and maintainability.
*/
