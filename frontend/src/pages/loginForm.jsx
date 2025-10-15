import React from "react";

function LoginForm() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#151d23] via-[#133248] to-[#111212] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-radial from-[#17d2e4]/20 via-[#133248]/40 to-transparent pointer-events-none"></div>
      <div className="relative z-10 bg-[#18181b] bg-opacity-85 text-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-[#1fd6c1]/30 backdrop-blur-lg">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#18d2e4] to-[#1fd6c1] bg-clip-text text-transparent">
          Login
        </h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Username or Email"
            className="w-full p-2 rounded bg-[#232d3f] border border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#26c6f9]"
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 rounded bg-[#232d3f] border border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#26c6f9]"
            autoComplete="current-password"
          />
          <div className="flex items-center justify-between text-sm mt-2">
            <a href="/forgot-password" className="text-[#1fd6c1] hover:underline">
              Forgot password?
            </a>
          </div>
          <button className="w-full py-2 bg-[#12adbb] rounded hover:bg-[#1fd6c1] text-white font-semibold transition shadow-lg shadow-[#17d2e4]/30">
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-gray-400">
          Don't have an account?{" "}
          <a href="/signup" className="text-[#1fd6c1] hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
