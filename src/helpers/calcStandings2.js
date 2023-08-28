const calcStandings2 = (matchResults) => {
    const standings = {};

    matchResults.forEach(match => {
        const { homeTeam, awayTeam, homeScore, awayScore } = match;

        if (!standings[homeTeam]) {
            standings[homeTeam] = { points: 0, goalsScored: 0, goalsConceded: 0 };
        }
        if (!standings[awayTeam]) {
            standings[awayTeam] = { points: 0, goalsScored: 0, goalsConceded: 0 };
        }

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
    });

    const sortedStandings = Object.keys(standings)
        .map(team => ({ team, ...standings[team] }))
        .sort((a, b) => b.points - a.points || (b.goalsScored - b.goalsConceded) - (a.goalsScored - a.goalsConceded));
        
    return sortedStandings;
}

export default calcStandings2;