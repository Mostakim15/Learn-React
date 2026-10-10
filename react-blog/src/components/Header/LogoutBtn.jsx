import React from "react";
import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";

function LogoutBtn() {
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      await authService.logout();
      dispatch(logout());
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button
      type="button"
      className="rounded-full border border-[#e9e2d7] px-4 py-2 text-sm font-semibold text-[#686b70] transition hover:border-[#b77945] hover:text-[#b77945]"
      onClick={logoutHandler}
    >
      Sign out
    </button>
  );
}

export default LogoutBtn;
