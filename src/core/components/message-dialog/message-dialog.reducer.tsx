import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MessageDialogState } from '../../models/state.model';

const initialState: MessageDialogState = {
    messages: []
};

export const MessageDialogSlice = createSlice({
    name: 'msgDialog',
    initialState: initialState,
    reducers: {
        setPropsMsgDialog: (state, actions: PayloadAction<MessageDialogState>) => {
            state = {
                ...state,
                ...actions.payload
            };

            return state;
        }
    }
});

export const { setPropsMsgDialog } = MessageDialogSlice.actions;
export default MessageDialogSlice.reducer;
