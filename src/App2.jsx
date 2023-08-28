import React, { useState, useEffect } from 'react';
import './App.css';

import axios from 'axios';
import pimps from './data/pimps_long.json';
// import StandingsTable from './StandingsTable';

import calcStandings from './helpers/calcStandings';
import calcStandings2 from './helpers/calcStandings2';
import calcStandings3 from './helpers/calcStandings3';
import calcStandings4 from './helpers/calcStandings4';

const apiKey = import.meta.env.VITE_FOOTBALL_API_KEY;

const options = {
    method: 'GET',
    headers: {
        'X-Auth-Token': apiKey,
        //'Accept-Encoding': '',
    },
};
const BASE_URL = 'https://api.football-data.org/v4/';

function App2() {
    const [matches, setMatches] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState('2022');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        // Fetch matches from the API
        const fetchMatches = async () => {
            try {
                //`${BASE_URL}competitions/${league_id}/matches?season=${year}`
                const response = await axios.get(
                    `${BASE_URL}competitions/2021/matches?season=${selectedSeason}`,
                    // `${BASE_URL}matches?competitions=PL&status=FINISHED&dateFrom=2022-08-05&dateTo=2023-05-28`,
                    options
                );
                const results = response.data.matches.filter(
                    (p) =>
                        !pimps.includes(p.homeTeam.name) && !pimps.includes(p.awayTeam.name)
                );
                setMatches(results);
                // setMatches(response.data.matches);
                // console.log(results /*response.data.matches*/);
                setIsLoading(false)
            } catch (error) {
                console.error(error);
            }
        };

        fetchMatches();
    }, [selectedSeason]);

    function gameStatus(x) {
        return x === 'FINISHED';
    }

    const matchResults = matches
        .filter((r) => gameStatus(r.status))
        .map((m) =>
        //let dataDayCommon = m.utcDate.split('T');
        //let dataDay = dataDayCommon[0].split('-').reverse().join('-');
        //let time = dataDayCommon[1].slice(0, -4);
        ({
            //   d: m.id,
            //   name: m.stage,
            awayTeam: m.awayTeam.name,
            homeTeam: m.homeTeam.name,
            awayCrest: m.awayTeam.crest,
            homeCrest: m.homeTeam.crest,
            //   status: m.status,
            //   outcome: m.score.winner,
            //dataDay: dataDay,
            //time: time,
            awayScore: m.score.fullTime.away,
            homeScore: m.score.fullTime.home,
        })
        );

    console.log(matches);

    const sortedStandings = calcStandings4(matchResults);

    // Step 4: Render standings using React.js
    return (
        <div className="App2">
            <label className='label'>
                Season:
                <select className='select select-sm w-full max-w-xs' name="selectedSeason"
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                >
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                </select>
            </label>
            <h1 className=''>Standings</h1>
            {isLoading ? (
                <h1>Loading...</h1>
            ) : (
                <div className='overflow-x-auto'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Pos</th>
                                <th>Crest</th>
                                <th>Team</th>
                                <th>GF</th>
                                <th>GA</th>
                                <th>GD</th>
                                <th>Pts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedStandings.map((teamData, index) => (
                                <tr className='hover' key={index}>
                                    <td>{index + 1}</td>
                                    <td className='w-1 rounded-full'><img src={teamData.crest} alt='team-crest' /></td>
                                    <td>{teamData.team}</td>
                                    <td>{teamData.goalsScored}</td>
                                    <td>{teamData.goalsConceded}</td>
                                    <td>{teamData.goalsScored - teamData.goalsConceded}</td>
                                    <td>{teamData.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p>The season you selected is: {selectedSeason}</p>
                </div>
            )}
        </div>
    )
}

export default App2;
