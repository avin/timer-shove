import type { RootState } from './reducers';

export const timerSetupStringSelector = (state: RootState): string => state.uiSettings.timerSetupString;
