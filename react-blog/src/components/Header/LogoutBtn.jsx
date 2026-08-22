import React from 'react'

import {useDispatch} from 'react-redux';
import {logout} from '../../store/authSlice.js';
import authService from '../../appwrite/auth.js';

function LogoutBtn() {
    const dispatch = useDispatch();
    const logoutHandler = async () => {
        try {
            await authService.logout().then(() => {
                dispatch(logout());
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
  return (
    <button
    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    onClick={logoutHandler}
  >
    Logout

    </button>
  )
}

export default LogoutBtn