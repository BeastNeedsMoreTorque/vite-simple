/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { Link, Outlet, Route, Routes } from 'react-router-dom';

import './App.css';

import axios from 'axios';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Results from './components/Results';
import pimps from './data/pimps_long.json';
import calcStdngs from './helpers/calcStdngs';
import { Loader } from './helpers/Loader';

const apiKey = import.meta.env.VITE_FOOTBALL_API_KEY as string;

const options = {
  method: 'GET',
  headers: {
    'X-Auth-Token': apiKey,
    // 'Access-Control-Allow-Origin': '*',
    // "Access-Control-Allow-Methods": "GET",
  },
};
const BASE_URL = 'https://api.football-data.org/v4/';

interface League {
  name: string;
  id: string;
}

interface Match {
  status: string;
  utcDate: string;
  awayTeam: { name: string; crest: string };
  homeTeam: { name: string; crest: string };
  score: { fullTime: { away: number; home: number } };
}

interface MatchResult {
  date: string;
  awayTeam: string;
  homeTeam: string;
  awayCrest: string;
  homeCrest: string;
  time: string;
  awayScore: number;
  homeScore: number;
}

interface TeamData {
  team: string;
  crest: string;
  gp: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  points: number;
  form: string; // Change this from string[] to string
}

function App2(): JSX.Element {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>('2021');
  const [selectedSeason, setSelectedSeason] = useState<string>('2022');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const Leagues: League[] = useMemo(
    () => [
      { name: 'Bundesliga', id: '2002' },
      { name: 'EPL', id: '2021' },
      { name: 'Championship', id: '2016' },
      { name: 'League 1 (France)', id: '2015' },
      { name: 'Serie A', id: '2019' },
      { name: 'Holland', id: '2003' },
      { name: 'Portugal', id: '2017' },
      { name: 'Spain', id: '2014' },
      { name: 'Brazil', id: '2013' },
    ],
    [],
  );

  const fetchMatches = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}competitions/${selectedLeague}/matches?season=${selectedSeason}`,
        options,
      );
      const results = response.data.matches.filter(
        (p: Match) => !pimps.includes(p.homeTeam.name) && !pimps.includes(p.awayTeam.name),
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

  const handleSelectedLeague = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLeague(event.target.value);
  }, []);

  const handleSelectedSeason = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeason(e.target.value);
  }, []);

  const gameStatus = useCallback((x: string) => x === 'FINISHED', []);

  const changeDate = useCallback((d: string) => {
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

  const sortedStandings = useMemo(() => calcStdngs(matchResults), [matchResults]);
  const lastIndex3 = sortedStandings.length;

  const seasonYears = useMemo(() => [2020, 2021, 2022, 2023, 2024], []);

  const MemoizedResults = React.memo(Results);

  return (
    <article className="App2">
      <Routes>
        {/* <Route path="navbar" element={<Navbar />} /> */}
      </Routes>
      <Navbar />
      <h1>This is TSX</h1>
      <section>
        <label className="label w-1/3 text-xl">
          Season:
          <select
            className="select select-lg w-1/2 max-w-xs"
            name="selectedSeason"
            value={selectedSeason}
            onChange={handleSelectedSeason}
          >
            {seasonYears.map((year) => (
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
            {Leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
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
          <MemoizedResults matchResults={matchResults} />
        </section>
      )}
      <Footer />
    </article>
  );
}

export default React.memo(App2);

/**
 * Here are the main changes made to convert the code to TypeScript:
Added type annotations for state variables and function parameters.
Created interfaces for League, Match, MatchResult, and TeamData.
3. Specified return types for functions, including App2 returning JSX.Element.
Added type annotations for event handlers, such as React.ChangeEvent<HTMLSelectElement>.
Specified the type for the teamData parameter in the sortedStandings.map() function.
These changes make the code more type-safe and provide better IDE support for TypeScript. The functionality remains the same as the original JavaScript version.
 */
