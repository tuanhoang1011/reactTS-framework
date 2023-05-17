import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SplashScreenState } from '../../models/state.model';

const initialState: SplashScreenState = {
    isOn: true
};

export const SplashScreenSlice = createSlice({
    name: 'splashScreen',
    initialState: initialState,
    reducers: {
        setProps: (state, actions: PayloadAction<SplashScreenState>) => {
            state = {
                ...state,
                ...actions.payload
            };
            return state;
        }
    }
});

export const { setProps } = SplashScreenSlice.actions;
export default SplashScreenSlice.reducer;
