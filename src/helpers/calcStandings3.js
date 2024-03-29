//Functional version of the code, where the assignment with the += operator is 
//replaced with object spread and ternary conditional operators.

const calcStandings3 = (matchResults) => {
    const standings = {};

    matchResults.forEach(match => {
        const { homeTeam, awayTeam, homeScore, awayScore } = match;

        standings[homeTeam] = {
            ...standings[homeTeam],
            goalsScored: (standings[homeTeam]?.goalsScored || 0) + homeScore,
            goalsConceded: (standings[homeTeam]?.goalsConceded || 0) + awayScore,
            points: (standings[homeTeam]?.points || 0) + (homeScore > awayScore ? 3 : homeScore === awayScore ? 1 : 0),
        };

        standings[awayTeam] = {
            ...standings[awayTeam],
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

export default calcStandings3;