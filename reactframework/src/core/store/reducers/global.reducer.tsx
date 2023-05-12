import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GlobalState } from '../../models/state.model';

const initialState: GlobalState = {
    errorPage: undefined
};

export const GlobalSlice = createSlice({
    name: 'global',
    initialState: initialState,
    reducers: {
        setPropsGlobal: (state, actions: PayloadAction<GlobalState>) => {
            state = {
                ...state,
                ...actions.payload
            };
            return state;
        }
    }
});

export const { setPropsGlobal } = GlobalSlice.actions;
export default GlobalSlice.reducer;
