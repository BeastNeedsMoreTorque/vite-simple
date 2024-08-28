/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import _ from 'lodash';

import './App.css';

import axios from 'axios';

import pimps from './data/pimps_long.json';
// import StandingsTable from './StandingsTable';

import calcStandings from './helpers/calcStandings';
import calcStandings2 from './helpers/calcStandings2';
import calcStandings3 from './helpers/calcStandings3';
import calcStandings4 from './helpers/calcStandings4';
import { Loader } from './helpers/Loader';

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
  { Bundesliga: '2002' },
  { EPL: '2021' },
  { Championship: '2016' },
  { 'League 1 (France)': '2015' },
  { 'Serie A': '2019' },
  { Holland: '2003' },
  { Portugal: '2017' },
  { Spain: '2014' },
  { Brazil: '2013' },
];

function App2() {
  const [matches, setMatches] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('2021');
  const [selectedSeason, setSelectedSeason] = useState('2022');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Fetch matches from the API
    const fetchMatches = async () => {
      try {
        //`${BASE_URL}competitions/${league_id}/matches?season=${year}`
        const response = await axios.get(
          `${BASE_URL}competitions/${selectedLeague}/matches?season=${selectedSeason}`,
          // `${BASE_URL}matches?competitions=PL&status=FINISHED&dateFrom=2022-08-05&dateTo=2023-05-28`,
          options,
        );
        const results = response.data.matches.filter(
          (p) => !pimps.includes(p.homeTeam.name) && !pimps.includes(p.awayTeam.name),
        );
        setMatches(results);
        // setMatches(response.data.matches);
        // console.log(results /*response.data.matches*/);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMatches();
  }, [selectedLeague, selectedSeason]);

  const handleSelectedLeague = (event) => {
    setSelectedLeague(event.target.value);
  };

  function gameStatus(x) {
    return x === 'FINISHED';
  }

  function changeDate(d) {
    const utcDate = new Date(d); // UTC date string
    const gmtDate = utcDate.toLocaleString('en-GB', { timeZone: 'GMT' });
    const dataDayCommon = gmtDate.split(',');
    const dataDay = dataDayCommon[0].split('/').join('-');
    const time = dataDayCommon[1].slice(1, -3);
    return { dataDay, time }; //gmtDate;
  }

  const matchResults = matches
    .filter((r) => gameStatus(r.status))
    .map((m) => {
      // const utcDate = new Date(m.utcDate); // UTC date string
      // const gmtDate = utcDate.toLocaleString('en-US', { timeZone: 'GMT' });
      // let dataDayCommon = m.utcDate.split('T');
      // let dataDay = dataDayCommon[0].split('-').reverse().join('-');
      // let time = dataDayCommon[1].slice(0, -4);
      const { dataDay, time } = changeDate(m.utcDate);
      //(
      return {
        //   d: m.id,
        //   name: m.stage,
        date: dataDay, //changeDate(m.utcDate),
        awayTeam: m.awayTeam.name,
        homeTeam: m.homeTeam.name,
        awayCrest: m.awayTeam.crest,
        homeCrest: m.homeTeam.crest,
        //   status: m.status,
        //   outcome: m.score.winner,
        // dataDay: dataDay,
        time: time,
        awayScore: m.score.fullTime.away,
        homeScore: m.score.fullTime.home,
      };
      //)
    });

  console.log('awayTeam: ', matchResults);

  const sortedStandings = calcStandings4(matchResults);
  const lastIndex3 =
    sortedStandings.map((x, index) => index).reduce((a, b) => b, sortedStandings.length - 1) + 1;
  console.log('lastIndex3: ', lastIndex3);

  // Step 4: Render standings using React.js
  return (
    <article className="App2">
      <section>
        <label className="label w-1/3 text-xl">
          Season:
          <select
            className="select select-lg w-1/2 max-w-xs"
            name="selectedSeason"
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
          >
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </label>
      </section>
      <section>
        <label className="label w-1/3 text-xl">
          League:
          <select
            className="select select-lg w-1/2 max-w-xs"
            name="selectedLeague"
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
        <h1 className="text-center text-3xl font-bold">Standings</h1>
      </section>
      {isLoading ? (
        // <h1>Loading...</h1>
        <Loader />
      ) : (
        <section>
          <section className="overflow-x-auto">
            <table className="table table-zebra">
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
                  <th>Form</th>
                </tr>
              </thead>
              <tbody>
                {sortedStandings.map((teamData, index) => {
                  //(
                  // NOTE: to use curly braces i need to use function syntax instead of arrow function syntax:
                  //{sortedStandings.map(function(teamData, index) {
                  //...
                  //})} OR
                  //{sortedStandings.map((teamData, index) => {
                  //return (....)
                  //})}
                  // const lastIndex2 = teamData.at(-1) !== undefined ? teamData.lastIndexOf(teamData.at(-1)) : -1;
                  const lastIndex =
                    (teamData.length > 0
                      ? teamData.lastIndexOf(teamData[teamData.length - 1])
                      : -1) + 1;
                  // const lastIndex3 = sortedStandings.map((x, index) => index).reduce((a, b) => b, sortedStandings.length - 1);
                  return (
                    <tr className="hover" key={index}>
                      <td>{index + 1}</td>
                      <td className="w-1 rounded-full">
                        <img src={teamData.crest} alt="team-crest" />
                      </td>
                      {index + 1 === 1 ? (
                        <td className="p-1 text-left font-bold text-green-400">{teamData.team}</td>
                      ) : index + 1 === lastIndex3 - 2 ||
                        index + 1 === lastIndex3 - 1 ||
                        index + 1 === lastIndex3 ? (
                        <td className="p-1 text-left font-semibold text-red-600">
                          {teamData.team}
                        </td>
                      ) : teamData.team === 'West Ham United FC' ? (
                        <td className="text-burgundy p-1 text-left text-xl font-extrabold">
                          {teamData.team}
                        </td>
                      ) : (
                        <td className="p-1 text-left">{teamData.team}</td>
                      )}
                      <td>{teamData.gp}</td>
                      <td>{teamData.goalsScored}</td>
                      <td>{teamData.goalsConceded}</td>
                      <td>{teamData.goalsScored - teamData.goalsConceded}</td>
                      <td>{teamData.points}</td>
                      <td className="hidden p-1 text-center md:table-cell">
                        <div className="flex">
                          {_.takeRight(teamData.form, 5).map((f, i) =>
                            f === 'w' ? (
                              <div
                                key={i}
                                className="mx-0.5 mb-2 h-3 w-1 rounded bg-green-500"
                              ></div>
                            ) : f === 'l' ? (
                              <div key={i} className="mx-0.5 mt-2 h-3 w-1 rounded bg-red-500"></div>
                            ) : (
                              <div
                                key={i}
                                className="mx-0.5 mb-1 h-1 w-1 rounded bg-gray-400"
                              ></div>
                            ),
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                  //)
                })}
              </tbody>
            </table>
            <p>The season you selected is: {selectedSeason}</p>
          </section>
          <section className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th className="text-right">Home</th>
                  <th></th>
                  <th></th>
                  <th>Away</th>
                </tr>
              </thead>
              <tbody>
                {matchResults.map((match, index) => (
                  <tr key={index}>
                    <td>{match.date}</td>
                    <td>{match.time}</td>
                    <td className="p1 text-right">{match.homeTeam}</td>
                    <td>{match.homeScore}</td>
                    <td>{match.awayScore}</td>
                    <td>{match.awayTeam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </section>
      )}
    </article>
  );
}

export default App2;
