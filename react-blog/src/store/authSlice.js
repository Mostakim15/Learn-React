import {createSlice} from '@reduxjs/toolkit';

const initialState = {
 status: false,
 userData: null,
};

const authSlice = createSlice({
 name: 'auth',
 initialState,
    reducers: {
    login: (state, action) => {
        state.status = true;
        state.userData = action.payload;
    },
    logout: (state) => {
        state.status = false;
        state.userData = null;
    }
  }
});

export const {login, logout} = authSlice.actions;

export default authSlice.reducer;

// this file for redux toolkit slice for authentication state management in react app. it contains initial state, reducers for login and logout actions, and exports the actions and reducer for use in the application.