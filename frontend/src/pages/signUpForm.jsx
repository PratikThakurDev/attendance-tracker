import React, { useState } from "react";
import { signup } from "../utils/api.js";
import { useNavigate } from "react-router-dom";

function SignUpForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.username,
        email: form.email,
        password: form.password,
      };

      await signup(payload);
      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      alert(err.error || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#151d23] via-[#133248] to-[#111212] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-[#17d2e4]/20 via-[#133248]/40 to-transparent pointer-events-none"></div>
      <div className="relative z-10 bg-[#18181b] bg-opacity-85 text-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-[#1fd6c1]/30 backdrop-blur-lg">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#18d2e4] to-[#1fd6c1] bg-clip-text text-transparent">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-1/2 p-2 rounded bg-[#232d3f] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#26c6f9]"
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-1/2 p-2 rounded bg-[#232d3f] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#26c6f9]"
            />
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#232d3f] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#26c6f9]"
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#232d3f] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#26c6f9]"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#232d3f] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#26c6f9]"
          />
          <button className="w-full py-2 bg-[#12adbb] rounded hover:bg-[#1fd6c1] text-white font-semibold transition shadow-lg shadow-[#17d2e4]/30">
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4 text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-[#1fd6c1] hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUpForm;
