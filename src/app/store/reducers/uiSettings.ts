import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type DataState = {
  language: string;
};

const initialState: DataState = {
  language: 'ru',
};

const slice = createSlice({
  name: 'uiSettings',
  initialState,
  reducers: {
    changeLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
  },
});

export const { changeLanguage } = slice.actions;

export default slice.reducer;
