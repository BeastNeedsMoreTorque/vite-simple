import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom';

import App from './App.jsx';
import App2 from './App2.tsx';
import ErrorPage from './error-page';
import Contact from './routes/contact.tsx';
import Root from './routes/root.tsx';

import './index.css';

import Teams from './components/Teams.tsx';
import Results from './components/Results.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'contacts/:contactId',
        element: <Contact />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <RouterProvider router={router} /> */}
    {/* <App /> */}
    <BrowserRouter>
    <Routes>
      <Route path="*" element={<App2 />}/>
      <Route path="results" element={<Results />}/>
      <Route path="teams" element={<Teams />}/>
    </Routes>
      {/* <App2 /> */}
    </BrowserRouter>
    {/* <Teams /> */}
  </React.StrictMode>,
);
