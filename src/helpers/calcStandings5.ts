/*
- You can define a type alias for the match results, such as 
`type MatchResult = { homeTeam: string; awayTeam: string; homeScore: number; 
    awayScore: number; homeCrest: string; awayCrest: string; }`. 
    This will make your code more readable and avoid using `any` 
    for the parameter type of `calcStandings4`.
- You can also define a type alias for the standings, such 
as `type Standing = { crest: string; gp: number; goalsScored: number; 
    goalsConceded: number; points: number; }`. This will make your 
    code more consistent and avoid using `any` for the property type of `standings`.
- You can use the `Record` utility type to create a type for the `standings` object, 
such as `type Standings = Record<string, Standing>`. This will make your code more 
concise and expressive.
- You can use the `Partial` utility type to create a type for the optional properties 
of `standings`, such as `type PartialStanding = Partial<Standing>`. This will make your 
code more flexible and avoid using the optional chaining operator (`?.`) or the nullish 
coalescing operator (`||`) for every property access.
- You can use the `as const` assertion to create a constant tuple for the possible points, 
such as `const POINTS = [0, 1, 3] as const`. This will make your code more robust and avoid 
using magic numbers or ternary operators for calculating the points.

*/
type MatchResult = {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeCrest: string;
  awayCrest: string;
};

type Standing = {
  crest: string;
  gp: number;
  goalsScored: number;
  goalsConceded: number;
  points: number;
};

// type Standings = Record<string, Standing>;

type Standings = Array<{
    team: string;
    crest?: string;
    gp?: number;
    goalsScored?: number;
    goalsConceded?: number;
    points?: number;
  }>;


type PartialStanding = Partial<Standing>;

const POINTS = [0, 1, 3] as const;

const updateTeamStanding = (
  standings: Record<string, PartialStanding>,
  team: string,
  crest: string,
  goalsScored: number,
  goalsConceded: number
): void => {
  standings[team] = {
    ...standings[team],
    crest,
    gp: (standings[team]?.gp ?? 0) + 1,
    goalsScored: (standings[team]?.goalsScored ?? 0) + goalsScored,
    goalsConceded: (standings[team]?.goalsConceded ?? 0) + goalsConceded,
    points: (standings[team]?.points ?? 0) + calculatePoints(goalsScored, goalsConceded),
  };
};

const calculatePoints = (teamScore: number, opponentScore: number): number => {
  if (teamScore > opponentScore) return POINTS[2];
  if (teamScore === opponentScore) return POINTS[1];
  return POINTS[0];
};

const sortStandings = (standings: Record<string, PartialStanding>): Standings => {
  return Object.keys(standings)
    .map(team => ({ team, ...standings[team] }))
    .sort((a, b) =>
      b.points - a.points ||
      (b.goalsScored - b.goalsConceded) - (a.goalsScored - a.goalsConceded)
    );
};

const calcStandings5 = (matchResults: MatchResult[]): Standings => {
  const standings: Record<string, PartialStanding> = {};

  matchResults.forEach(match => {
    const { homeTeam, awayTeam, homeScore, awayScore, homeCrest, awayCrest } = match;
    updateTeamStanding(standings, homeTeam, homeCrest, homeScore, awayScore);
    updateTeamStanding(standings, awayTeam, awayCrest, awayScore, homeScore);
  });

  return sortStandings(standings);
};

export default calcStandings5;

/**
 * This breakdown offers several benefits:
updateTeamStanding: Encapsulates the logic for updating a single team's standing.
calculatePoints: Simplifies the point calculation logic.
3. sortStandings: Separates the sorting logic from the main function.
These changes make the code more modular and easier to understand. Each function has a single responsibility, 
which adheres to the Single Responsibility Principle.
While this approach may not significantly improve performance (and could potentially have a slight overhead 
due to additional function calls), it offers better maintainability and testability. You can now unit test 
each function separately, making it easier to catch and fix bugs.
If performance is a critical concern, you might want to profile the original and refactored versions to 
ensure there's no significant performance degradation. In most cases, the improved readability and 
maintainability would outweigh any minor performance differences.
 */