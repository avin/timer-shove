import { combineReducers } from '@reduxjs/toolkit';
import uiSettings from './uiSettings';

const rootReducer = combineReducers({
  uiSettings,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
