import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SplashScreenState } from '../../models/state.model';

const initialState: SplashScreenState = {
    isOn: true
};

export const SplashScreenSlice = createSlice({
    name: 'splashScreen',
    initialState: initialState,
    reducers: {
        setPropsSplashScreen: (state, actions: PayloadAction<SplashScreenState>) => {
            state = {
                ...state,
                ...actions.payload
            };
            return state;
        }
    }
});

export const { setPropsSplashScreen } = SplashScreenSlice.actions;
export default SplashScreenSlice.reducer;
