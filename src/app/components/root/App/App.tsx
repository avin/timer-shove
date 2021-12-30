import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Store } from '@reduxjs/toolkit';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import MainPage from '../../pages/MainPage/MainPage';

export interface AppProps {
  store: Store;
}

const App = ({ store }: AppProps): JSX.Element => {
  return (
    <Provider store={store}>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

export default App;
