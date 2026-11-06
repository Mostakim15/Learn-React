import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (authentication && authStatus !== authentication) {
      navigate("/login");
    } else if (!authentication && authStatus !== authentication) {
      navigate("/");
    }
  }, [authStatus, navigate, authentication]);

  if (authentication && authStatus !== authentication) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-[#686b70]">
        Checking your session…
      </div>
    );
  }

  if (!authentication && authStatus !== authentication) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-[#686b70]">
        Redirecting…
      </div>
    );
  }

  return <>{children}</>;
}