/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';

import './App.css';

import axios from 'axios';

import pimps from '../../data/pimps_long.json';
// import StandingsTable from './components/StandingsTable';

import calcStandings5 from '../../helpers/calcStandings5.ts';
import calcStdngs from '../../helpers/calcStdngs.ts';
import { Loader } from '../../helpers/Loader.jsx';
import Footer from '../Footer.jsx';
import Navbar from '../Navbar.jsx';
// import Results from './components/Results';
import Results from '../Results.tsx';
import Teams from '../Teams.tsx';

const apiKey = import.meta.env.VITE_FOOTBALL_API_KEY;

const options = {
  method: 'GET',
  headers: {
    'X-Auth-Token': apiKey,
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

  const fetchMatches = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}competitions/${selectedLeague}/matches?season=${selectedSeason}`,
        options,
      );
      const results = response.data.matches.filter(
        (p) => !pimps.includes(p.homeTeam.name) && !pimps.includes(p.awayTeam.name),
      );
      setMatches(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedLeague, selectedSeason]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const handleSelectedLeague = useCallback((event) => {
    setSelectedLeague(event.target.value);
  }, []);

  const gameStatus = useCallback((x) => x === 'FINISHED', []);

  const changeDate = useCallback((d) => {
    const utcDate = new Date(d);
    const gmtDate = utcDate.toLocaleString('en-GB', { timeZone: 'GMT' });
    const [dataDay, timeWithSeconds] = gmtDate.split(',');
    return {
      dataDay: dataDay.split('/').join('-'),
      time: timeWithSeconds.trim().slice(0, -3),
    };
  }, []);

  const matchResults = useMemo(
    () =>
      matches
        .filter((r) => gameStatus(r.status))
        .map((m) => {
          const { dataDay, time } = changeDate(m.utcDate);
          return {
            date: dataDay,
            awayTeam: m.awayTeam.name,
            homeTeam: m.homeTeam.name,
            awayCrest: m.awayTeam.crest,
            homeCrest: m.homeTeam.crest,
            time,
            awayScore: m.score.fullTime.away,
            homeScore: m.score.fullTime.home,
          };
        }),
    [matches, gameStatus, changeDate],
  );

  // const sortedStandings = useMemo(() => calcStandings5(matchResults), [matchResults]);
  const sortedStandings = useMemo(() => calcStdngs(matchResults), [matchResults]);
  const lastIndex3 = sortedStandings.length;

  return (
    <article className="App2">
      <Navbar />
      <section>
        <label className="label w-1/3 text-xl">
          Season:
          <select
            className="select select-lg w-1/2 max-w-xs"
            name="selectedSeason"
            value={selectedSeason}
            onChange={useCallback((e) => setSelectedSeason(e.target.value), [])}
          >
            {[2020, 2021, 2022, 2023, 2024].map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
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
            {Leagues.map((option, index) => {
              const [label, value] = Object.entries(option)[0];
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
                  <th>W</th>
                  <th>D</th>
                  <th>L</th>
                  <th>GF</th>
                  <th>GA</th>
                  <th>GD</th>
                  <th>Pts</th>
                  <th>Form</th>
                </tr>
              </thead>
              <tbody>
                {sortedStandings.map((teamData, index) => {
                  const position = index + 1;
                  const isChampion = position === 1;
                  const isRelegation = position >= lastIndex3 - 2;
                  const isWestHam = teamData.team === 'West Ham United FC';

                  return (
                    <tr className="hover" key={teamData.team}>
                      <td>{position}</td>
                      <td className="w-1 rounded-full">
                        <img src={teamData.crest} alt="team-crest" />
                      </td>
                      <td
                        className={`p-1 text-left ${
                          isChampion
                            ? 'font-bold text-green-400'
                            : isRelegation
                              ? 'font-semibold text-red-600'
                              : isWestHam
                                ? 'text-fuchsia-800 text-xl font-extrabold'
                                : ''
                        }`}
                      >
                        {teamData.team}
                      </td>
                      <td>{teamData.gp}</td>
                      <td>{teamData.wins}</td>
                      <td>{teamData.draws}</td>
                      <td>{teamData.losses}</td>
                      <td>{teamData.goalsScored}</td>
                      <td>{teamData.goalsConceded}</td>
                      <td>{teamData.goalsScored - teamData.goalsConceded}</td>
                      <td>{teamData.points}</td>
                      <td className="hidden p-1 text-center md:table-cell">
                        <div className="flex">
                          {_.takeRight(teamData.form, 5).map((f, i) => (
                            <div
                              key={i}
                              className={`mx-0.5 h-3 w-1 rounded ${
                                f === 'w'
                                  ? 'mb-2 bg-green-500'
                                  : f === 'l'
                                    ? 'mt-2 bg-red-500'
                                    : 'mb-1 h-1 bg-gray-400'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p>The season you selected is: {selectedSeason}</p>
          </section>
          <Results matchResults={matchResults} />
          {/* <Teams /> */}
        </section>
      )}
      <Footer />
    </article>
  );
}

export default App2;

// Original code (commented out for reference):
/*
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
    const { dataDay, time } = changeDate(m.utcDate);
    return {
      date: dataDay,
      awayTeam: m.awayTeam.name,
      homeTeam: m.homeTeam.name,
      awayCrest: m.awayTeam.crest,
      homeCrest: m.homeTeam.crest,
      time: time,
      awayScore: m.score.fullTime.away,
      homeScore: m.score.fullTime.home,
    };
  });

console.log('awayTeam: ', matchResults);

const sortedStandings = calcStandings5(matchResults);
const lastIndex3 =
  sortedStandings.map((x, index) => index).reduce((a, b) => b, sortedStandings.length - 1) + 1;
console.log('lastIndex3: ', lastIndex3);

// ... (rest of the original code)
*/
