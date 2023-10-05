import React, { useState, useEffect } from 'react';
import './App.css';
import { Loader } from './helpers/Loader';

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

const Leagues = [
    { "Bundesliga": '2002' },
    { "EPL": '2021' },
    { "Championship": '2016' },
    { "League 1 (France)": '2015' },
    { "Serie A": '2019' },
    { "Holland": '2003' },
    { "Portugal": '2017' },
    { "Spain": '2014' },
    { "Brazil": '2013' },
]

function App2() {
    const [matches, setMatches] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState('2021');
    const [selectedSeason, setSelectedSeason] = useState('2022');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        // Fetch matches from the API
        const fetchMatches = async () => {
            try {
                //`${BASE_URL}competitions/${league_id}/matches?season=${year}`
                const response = await axios.get(
                    `${BASE_URL}competitions/${selectedLeague}/matches?season=${selectedSeason}`,
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
    }, [selectedLeague, selectedSeason]);

    const handleSelectedLeague = (event) => {
        setSelectedLeague(event.target.value);
    }

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
        <article className="App2">
            <section>
                <label className='label text-xl w-1/3'>
                    Season:
                    <select className='select select-lg w-1/2 max-w-xs' name="selectedSeason"
                        value={selectedSeason}
                        onChange={(e) => setSelectedSeason(e.target.value)}
                    >
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                    </select>
                </label>
            </section>
            <section>
                <label className='label text-xl w-1/3'>
                    League:
                    <select className='select select-lg w-1/2 max-w-xs' name='selectedLeague'
                        value={selectedLeague}
                        onChange={handleSelectedLeague}
                    >
                        <option value="">Select a League</option>
                        {/* {Object.keys(Leagues).map((key, value) => (
                        <option key={key} value={value}>
                            {Leagues[key]}
                        </option>
                    ))} */}
                        {/* {Leagues.map((league) => <option key={league.key} value={league.value}></option>)} */}
                        {Leagues.map((option, index) => {
                            const label = Object.keys(option)[0]; // Assuming each object has only one key
                            const value = option[label];
                            return (
                                <option key={index} value={value}>
                                    {label}
                                </option>
                            );
                        })}
                    </select>
                </label>
            </section>
            <section>
                <h1 className='text-3xl text-center font-bold'>Standings</h1>
            </section>
            {isLoading ? (
                // <h1>Loading...</h1>
                <Loader />
            ) : (
                <section className='overflow-x-auto'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Pos</th>
                                <th>Crest</th>
                                <th>Team</th>
                                <th>GP</th>
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
                                    <td>{teamData.gp}</td>
                                    <td>{teamData.goalsScored}</td>
                                    <td>{teamData.goalsConceded}</td>
                                    <td>{teamData.goalsScored - teamData.goalsConceded}</td>
                                    <td>{teamData.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p>The season you selected is: {selectedSeason}</p>
                </section>
            )}
        </article>
    )
}

export default App2;
