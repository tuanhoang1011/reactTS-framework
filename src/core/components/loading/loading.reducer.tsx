import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LoadingState } from '../../models/state.model';

const initialState: LoadingState = {
    isOn: false
};

export const LoadingSlice = createSlice({
    name: 'loading',
    initialState: initialState,
    reducers: {
        setPropsLoading: (state, actions: PayloadAction<LoadingState>) => {
            state = {
                ...state,
                ...actions.payload
            };
            return state;
        }
    }
});

export const { setPropsLoading } = LoadingSlice.actions;
export default LoadingSlice.reducer;
