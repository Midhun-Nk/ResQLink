import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";

// Social Icons UI Only
const SocialIcon = ({ char }) => (
  <a className="text-xl text-gray-400 hover:text-gray-600 transition">{char}</a>
);

// LOGIN UI ONLY
const LoginView = ({ onToggle }) => (
  <section className="text-center w-full max-w-md">
    <h2 className="text-4xl font-extrabold mb-1">Welcome to Emerald</h2>
    <p className="text-gray-600 mb-10">Hotels & Resorts</p>

    <form className="flex flex-col space-y-4">
      <input type="email" placeholder="Email" className="p-3 border border-gray-300 rounded-lg" />
      <input type="password" placeholder="Password" className="p-3 border border-gray-300 rounded-lg" />

      <a className="text-custom-red text-sm font-semibold text-right hover:underline pt-1">
        Forgot password?
      </a>

      <div className="flex items-center py-2 text-gray-500 text-sm">
        <div className="flex-grow border-t border-dashed border-gray-300"></div>
        <span className="mx-4">or</span>
        <div className="flex-grow border-t border-dashed border-gray-300"></div>
      </div>

      <button className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
        <span className="text-xl mr-2 text-blue-600 font-bold">G</span> Login with Google
      </button>

      <button className="bg-red-600 text-white p-3 rounded-lg font-bold text-lg hover:bg-red-700 transition shadow-lg shadow-red-300">
        Login
      </button>
    </form>

    <p className="text-gray-700 text-sm mt-6">
      Don't have an account?{" "}
      <button onClick={() => onToggle(false)} className="text-custom-red font-semibold hover:underline">
        Sign up
      </button>
    </p>

    <div className="flex justify-center space-x-6 mt-8">
      <SocialIcon char="f" /><SocialIcon char="t" /><SocialIcon char="in" /><SocialIcon char="ig" />
    </div>
  </section>
);

// REGISTER UI ONLY
const RegisterView = ({ onToggle }) => (
  <section className="text-center w-full max-w-md">
    <h2 className="text-4xl font-extrabold mb-1">Join Emerald</h2>
    <p className="text-gray-600 mb-10">Create your account to start booking</p>

    <form className="flex flex-col space-y-4">
      <input type="text" placeholder="Full Name" className="p-3 border border-gray-300 rounded-lg" />
      <input type="email" placeholder="Email" className="p-3 border border-gray-300 rounded-lg" />
      <input type="password" placeholder="Password" className="p-3 border border-gray-300 rounded-lg" />
      <input type="password" placeholder="Confirm Password" className="p-3 border border-gray-300 rounded-lg" />

      <button className="bg-red-600 text-white p-3 rounded-lg font-bold text-lg hover:bg-red-700 transition mt-4 shadow-lg shadow-red-300">
        Register Account
      </button>
    </form>

    <p className="text-gray-700 text-sm mt-6">
      Already have an account?{" "}
      <button onClick={() => onToggle(true)} className="text-custom-red font-semibold hover:underline">
        Log in
      </button>
    </p>

    <div className="flex justify-center space-x-6 mt-8">
      <SocialIcon char="f" /><SocialIcon char="t" /><SocialIcon char="in" /><SocialIcon char="ig" />
    </div>
  </section>
);

// BG images (same as original)
const bg_images = ['login-bg.jpg','login-bg2.jpg','login-bg.jpg',];

// MAIN UI PURE REACT
const LoginRegisterPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentBgIndex((prev) => (prev + 1) % bg_images.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <>
      <Helmet>
        <title>{isLoginView ? "Login" : "Sign Up"}</title>
        <style>{`.text-custom-red { color:#ff4757 }`}</style>
      </Helmet>

      <main className="flex w-full justify-center items-center bg-white py-5 px-10 mt-20">
        <div className="flex w-full h-[85vh] overflow-hidden rounded-3xl bg-white">

          {/* LEFT PANEL */}
          <div className="relative w-5/12 p-10 text-white flex flex-col justify-between rounded-l-3xl">

            {/* FULLSCREEN BG IMAGE LIKE NEXT/IMAGE */}
            <img
              src={bg_images[currentBgIndex]}
              className="absolute inset-0 w-full h-full object-cover duration-1000"
              alt="bg"
            />
            <div className="absolute inset-0 bg-black opacity-40"></div>

            <header className="relative z-10 flex justify-between items-center">
              <span className="font-semibold text-lg">EMARALD</span>

              <nav className="flex space-x-4">
                <button
                  onClick={() => setIsLoginView(false)}
                  className={`px-5 py-2 rounded-lg border font-semibold transition ${
                    !isLoginView ? "bg-white text-black" : "text-white border-white"
                  }`}>
                  Sign Up
                </button>

                <button
                  onClick={() => setIsLoginView(true)}
                  className={`px-5 py-2 rounded-lg border font-semibold transition ${
                    isLoginView ? "bg-white text-black" : "text-white border-white"
                  }`}>
                  Join Us
                </button>
              </nav>
            </header>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-7/12 flex justify-center items-center p-16">
            {isLoginView ? <LoginView onToggle={setIsLoginView} /> : <RegisterView onToggle={setIsLoginView} />}
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginRegisterPage;
