import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MessageToastState } from '../../models/state.model';

const initialState: MessageToastState = {
    messages: [],
    clearAll: false
};

export const MessageToastSlice = createSlice({
    name: 'msgToast',
    initialState: initialState,
    reducers: {
        setPropsMsgToast: (state, actions: PayloadAction<MessageToastState>) => {
            state = {
                ...state,
                ...actions.payload
            };

            return state;
        }
    }
});

export const { setPropsMsgToast } = MessageToastSlice.actions;
export default MessageToastSlice.reducer;
