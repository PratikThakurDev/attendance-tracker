import React, { useState } from "react";
import { login } from "../utils/api.js";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login(form);
      localStorage.setItem("token", data.token);

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#151d23] via-[#133248] to-[#111212] relative overflow-hidden">
      <div className="relative z-10 bg-[#18181b] text-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-[#1fd6c1]/30">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#1fd6c1]">Login</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#232d3f] border border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-[#26c6f9]"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#232d3f] border border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-[#26c6f9]"
          />

          <button
            type="submit"
            className="w-full py-2 bg-[#12adbb] rounded hover:bg-[#1fd6c1] text-white font-semibold transition"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-gray-400">
          Don’t have an account?{" "}
          <a href="/signup" className="text-[#1fd6c1] hover:underline">
            Sign Up
          </a>
        </p>
      </div>
      
    </div>
  );
}

export default LoginForm;
