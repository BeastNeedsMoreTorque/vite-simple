import { useState, useEffect } from "react";
import "./App.css";

import axios from "axios";
import pimps from "./data/pimps_long.json";
// import StandingsTable from './StandingsTable';

const apiKey = import.meta.env.VITE_FOOTBALL_API_KEY;

const options = {
  method: "GET",
  headers: {
    "X-Auth-Token": apiKey,
    //'Accept-Encoding': '',
  },
};
const BASE_URL = "https://api.football-data.org/v4/";

function App() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Fetch matches from the API
    const fetchMatches = async () => {
      try {
        //`${BASE_URL}competitions/${league_id}/matches?season=${year}`
        const response = await axios.get(
          // `${BASE_URL}competitions/2021/matches?season=2021`,
          // `${BASE_URL}matches?competitions=PL&status=FINISHED&dateFrom=2022-08-05&dateTo=2023-05-28`,
          `${BASE_URL}competitions/PL/matches`, //?matchday=11
          options,
        );
        const results = response.data.matches.filter(
          (p) =>
            !pimps.includes(p.homeTeam.name) &&
            !pimps.includes(p.awayTeam.name),
        );
        setMatches(results);
        // setMatches(response.data.matches);
        // console.log("App results: ", results /*response.data.matches*/);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMatches();
  }, []);

  const matchesResults = matches;

  return (
    <section className="App">
      {/* <App2 /> */}
      <h1 className="flex-auto px-4 py-4">Match Results</h1>
    </section>
  );
}

export default App;
