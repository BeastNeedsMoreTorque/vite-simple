//Functional version of the code, where the assignment with the += operator is 
//replaced with object spread and ternary conditional operators.

const calcStandings4 = (matchResults) => {
    const standings = {};

    matchResults.forEach(match => {
        const { homeTeam, awayTeam, homeScore, awayScore, homeCrest, awayCrest } = match;
        let gamesPlayed = 0;
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