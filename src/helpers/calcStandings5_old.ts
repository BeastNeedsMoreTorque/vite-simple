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
  
  const calcStandings5 = (matchResults: MatchResult[]): Standings => {
  //   const standings: Standings = {};
    const standings: Record<string, PartialStanding> = {};
  
    matchResults.forEach(match => {
      const { homeTeam, awayTeam, homeScore, awayScore, homeCrest, awayCrest } =
        match;
  
      standings[homeTeam] = {
        ...standings[homeTeam],
        crest: homeCrest,
        gp: (standings[homeTeam]?.gp ?? 0) + 1,
        goalsScored: (standings[homeTeam]?.goalsScored ?? 0) + homeScore,
        goalsConceded: (standings[homeTeam]?.goalsConceded ?? 0) + awayScore,
        points:
          (standings[homeTeam]?.points ?? 0) +
          POINTS[homeScore > awayScore ? 2 : homeScore === awayScore ? 1 : 0],
      };
  
      standings[awayTeam] = {
        ...standings[awayTeam],
        crest: awayCrest,
        gp: (standings[awayTeam]?.gp ?? 0) + 1,
        goalsScored: (standings[awayTeam]?.goalsScored ?? 0) + awayScore,
        goalsConceded: (standings[awayTeam]?.goalsConceded ?? 0) + homeScore,
        points:
          (standings[awayTeam]?.points ?? 0) +
          POINTS[awayScore > homeScore ? 2 : awayScore === homeScore ? 1 : 0],
      };
    });
  
    const sortedStandings = Object.keys(standings)
      .map(team => ({ team, ...standings[team] }))
      .sort(
        (a, b) =>
          (b.points ?? 0) - (a.points ?? 0) ||
          ((b.goalsScored ?? 0) - (b.goalsConceded ?? 0)) - ((a.goalsScored ?? 0) - (a.goalsConceded ?? 0))
      );
  
    
      return sortedStandings;
  
  //   const sortedStandings = Object.fromEntries(
  //     Object.entries(standings).sort(
  //       ([teamA, standingA], [teamB, standingB]) =>
  //         standingB.points - standingA.points ||
  //         (standingB.goalsScored - standingB.goalsConceded) -
  //           (standingA.goalsScored - standingA.goalsConceded)
  //     )
  //   ) as Standings;
  
  };
  
  export default calcStandings5;