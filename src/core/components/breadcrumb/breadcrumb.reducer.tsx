import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LayoutState } from '../../models/state.model';

const initialState: LayoutState = {
    breadcrumbs: undefined
};

export const BreadcrumbSlice = createSlice({
    name: 'breadcrumb',
    initialState: initialState,
    reducers: {
        setProps: (state, actions: PayloadAction<LayoutState>) => {
            state = {
                ...state,
                ...actions.payload
            };
            return state;
        }
    }
});

export const { setProps } = BreadcrumbSlice.actions;
export default BreadcrumbSlice.reducer;
