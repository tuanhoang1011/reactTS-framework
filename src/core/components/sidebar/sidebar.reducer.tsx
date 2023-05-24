import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LayoutState } from '../../models/state.model';
import { GlobalVariables } from '../../utils/global-variables.util';

const initialState: LayoutState = {
    expandSidebar: window.innerWidth >= GlobalVariables.standardSize.lg
};

export const SidebarSlice = createSlice({
    name: 'sidebar',
    initialState: initialState,
    reducers: {
        setPropsSidebar: (state, actions: PayloadAction<LayoutState>) => {
            state = {
                ...state,
                ...actions.payload
            };
            return state;
        }
    }
});

export const { setPropsSidebar } = SidebarSlice.actions;
export default SidebarSlice.reducer;
