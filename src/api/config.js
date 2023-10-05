import axios from 'axios';

const apiKey = import.meta.env.VITE_FOOTBALL_API_KEY;

const options = {
    method: 'GET',
    headers: {
        'X-Auth-Token': apiKey,
    }
}

const BASE_URL = 'https://api.football-data.org/v4/';

export const getMatches = (season, league) => {
    return axios.get(
        `${BASE_URL}competitions/${season}/matches?=season=${league}`, 
        options
    );
}