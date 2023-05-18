import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DialogManagerState } from '../../models/state.model';

const initialState: DialogManagerState = {
    dialogs: []
};

export const DialogMagagerSlice = createSlice({
    name: 'dialogManager',
    initialState: initialState,
    reducers: {
        setPropsDialogManager: (state, actions: PayloadAction<DialogManagerState>) => {
            state = {
                ...state,
                ...actions.payload
            };

            return state;
        }
    }
});

export const { setPropsDialogManager } = DialogMagagerSlice.actions;
export default DialogMagagerSlice.reducer;
