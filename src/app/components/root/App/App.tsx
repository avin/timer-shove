import React from 'react';
import { Provider } from 'react-redux';
import { Store } from '@reduxjs/toolkit';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import MainPage from '../../pages/MainPage/MainPage';

export interface AppProps {
  store: Store;
}

const App = ({ store }: AppProps): JSX.Element => (
  <Provider store={store}>
    <MemoryRouter>
      <div className="App">
        <h1>Welcome to React Router!</h1>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </div>
    </MemoryRouter>
  </Provider>
);

export default App;
