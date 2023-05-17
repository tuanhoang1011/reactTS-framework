import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LayoutState } from '../../models/state.model';

const initialState: LayoutState = {
    breadcrumbs: undefined
};

export const BreadcrumbSlice = createSlice({
    name: 'breadcrumb',
    initialState: initialState,
    reducers: {
        setPropsBreadcrumb: (state, actions: PayloadAction<LayoutState>) => {
            state = {
                ...state,
                ...actions.payload
            };
            return state;
        }
    }
});

export const { setPropsBreadcrumb } = BreadcrumbSlice.actions;
export default BreadcrumbSlice.reducer;
