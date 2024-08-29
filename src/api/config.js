import axios from 'axios';

const apiKey = import.meta.env.VITE_FOOTBALL_API_KEY;

const options = {
    method: 'GET',
    headers: {
        'X-Auth-Token': apiKey,
    }
}

const BASE_URL = 'https://api.football-data.org/v4/';

export const getMatches = (selectedLeague, selectedSeason) => {
    return axios.get(
        `${BASE_URL}competitions/${selectedLeague}/matches?season=${selectedSeason}`,
        options
    );
}

export const getTeam = (team, year) => {
    return axios.get(
        `${BASE_URL}teams/${team}/matches?season=${year}`,
        options
    );
}