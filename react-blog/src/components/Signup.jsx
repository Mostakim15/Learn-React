import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../appwrite/auth.js";
import { login } from "../store/authSlice";
import { Button, Input } from "./index.js";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const create = async (data) => {
    setError("");
    try {
      const session = await authService.createAccount(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(login(userData));
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Unable to create your account. Please try again.");
    }
  };

  return (
    <main className="px-5 py-14 sm:py-20">
      <div className="mx-auto max-w-md rounded-2xl border border-[#e9e2d7] bg-white p-7 shadow-[0_15px_50px_rgba(23,43,58,0.05)] sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b77945]">Join the journal</p>
        <h1 className="editorial-serif mt-3 text-4xl font-bold text-[#172b3a]">Make room for good ideas.</h1>
        <p className="mt-3 text-sm leading-6 text-[#686b70]">Create an account to write and share your own stories.</p>
        {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={handleSubmit(create)} className="mt-8 space-y-5">
          <div>
            <Input label="Full name" placeholder="Your name" autoComplete="name" {...register("name", { required: "Name is required" })} />
            {errors.name && <p className="mt-1 text-xs text-red-700">{errors.name.message}</p>}
          </div>
          <div>
            <Input label="Email address" type="email" placeholder="you@example.com" autoComplete="email" {...register("email", { required: "Email is required" })} />
            {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email.message}</p>}
          </div>
          <div>
            <Input label="Password" type="password" placeholder="At least 8 characters" autoComplete="new-password" {...register("password", { required: "Password is required", minLength: { value: 8, message: "Use at least 8 characters" } })} />
            {errors.password && <p className="mt-1 text-xs text-red-700">{errors.password.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? "Creating account…" : "Create account"}</Button>
        </form>
        <p className="mt-7 text-center text-sm text-[#686b70]">Already a member? <Link to="/login" className="font-bold text-[#b77945] hover:underline">Sign in</Link></p>
      </div>
    </main>
  );
}

export default Signup;
