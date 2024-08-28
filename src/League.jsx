import { useState } from 'react';

const League = [
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

function Leagues() {
  const [clicked, setClicked] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState('2021');
  const [selectedSeason, setSelectedSeason] = useState('2022');

  const handleSetSelectedLeague = (event) => {
    setSelectedLeague(event.target.value);
  };

  return (
    <>
      <div>
        <div>
          <label className="label text-xl w-1/3">
            League:
            <select
              className="select select-lg w-1/2 max-w-xs"
              value={selectedLeague}
              onChange={handleSelectedLeague}
            >
              <option value="">Select a League</option>
              {League.map((option, index) => {
                const label = Object.keys(option)[0];
                const value = option[label];
                return (
                  <option key={index} value={value}>
                    {label}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
      </div>
    </>
  );
}
