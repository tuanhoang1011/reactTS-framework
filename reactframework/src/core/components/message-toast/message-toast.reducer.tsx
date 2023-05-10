import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MessageState } from '../../models/state.model';

const initialState: MessageState = {
    messages: [],
    clearAll: false
};

export const MessageToastSlice = createSlice({
    name: 'msgToast',
    initialState: initialState,
    reducers: {
        setProps: (state, actions: PayloadAction<MessageState>) => {
            state = {
                ...state,
                ...actions.payload
            };

            return state;
        }
    }
});

export const { setProps } = MessageToastSlice.actions;
export default MessageToastSlice.reducer;
