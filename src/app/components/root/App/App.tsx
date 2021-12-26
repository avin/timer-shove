import React from 'react';
import { Provider } from 'react-redux';
import { Store } from '@reduxjs/toolkit';
import { Routes, Route, Link, MemoryRouter } from 'react-router-dom';
import Home from '../../pages/Home/Home';
import About from '../../pages/About/About';

export interface AppProps {
  store: Store;
}

const App = ({ store }: AppProps): JSX.Element => (
  <Provider store={store}>
    <MemoryRouter>
      <div className="App">
        <h1>Welcome to React Router!</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
        </Routes>
      </div>
    </MemoryRouter>
  </Provider>
);

export default App;
