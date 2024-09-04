import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.jsx';
import App2 from './App2.tsx';

import './index.css';

import Teams from './components/Teams.tsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <App2 /> */}
    <Teams />
  </React.StrictMode>,
);
