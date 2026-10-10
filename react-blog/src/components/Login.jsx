import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input } from "./index";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [error, setError] = useState("");

  const login = async (data) => {
    setError("");
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(authLogin(userData));
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
    }
  };

  return (
    <main className="px-5 py-14 sm:py-20">
      <div className="mx-auto max-w-md rounded-2xl border border-[#e9e2d7] bg-white p-7 shadow-[0_15px_50px_rgba(23,43,58,0.05)] sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b77945]">Welcome back</p>
        <h1 className="editorial-serif mt-3 text-4xl font-bold text-[#172b3a]">Sign in to read on.</h1>
        <p className="mt-3 text-sm leading-6 text-[#686b70]">Continue to your saved corner of The Letterform.</p>
        {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={handleSubmit(login)} className="mt-8 space-y-5">
          <div>
            <Input label="Email address" type="email" placeholder="you@example.com" autoComplete="email" {...register("email", { required: "Email is required" })} />
            {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email.message}</p>}
          </div>
          <div>
            <Input label="Password" type="password" placeholder="Your password" autoComplete="current-password" {...register("password", { required: "Password is required" })} />
            {errors.password && <p className="mt-1 text-xs text-red-700">{errors.password.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? "Signing in…" : "Sign in"}</Button>
        </form>
        <p className="mt-7 text-center text-sm text-[#686b70]">New here? <Link to="/signup" className="font-bold text-[#b77945] hover:underline">Create an account</Link></p>
      </div>
    </main>
  );
}

export default Login;
