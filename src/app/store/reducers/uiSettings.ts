import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunkAction } from '../configureStore';

type DataState = {
  timerSetupString: string;
};

const initialState: DataState = {
  timerSetupString: '40 minutes',
};

const slice = createSlice({
  name: 'uiSettings',
  initialState,
  reducers: {
    setUiSettingsValues: (state, action: PayloadAction<Partial<DataState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { setUiSettingsValues } = slice.actions;

export default slice.reducer;

export const setTimerSetupString =
  (value: string): AppThunkAction<Promise<void>> =>
  async (dispatch) => {
    dispatch(setUiSettingsValues({ timerSetupString: value }));

    void window.ipcRenderer.invoke('setStoreValue', { key: 'timerSetupString', value });
  };
