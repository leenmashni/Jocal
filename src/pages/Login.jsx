
// src/pages/LoginRegister.jsx
import React, { useState } from "react";
import "../styles/Login.css";

const Login = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const containerClass = isSignUpActive ? "login-container right-panel-active" : "login-container";

  const handleToggle = () => setIsSignUpActive(!isSignUpActive);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error("Error:", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registration successful! You can now sign in.");
        setIsSignUpActive(false);
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="login-wrapper">
      <div className={containerClass}>
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegister}>
            <h1>Create Account</h1>
            <div className="social-container">
              <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            </div>
            <span>or use your email for registration</span>
            <input type="text" name="username" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <h1>Sign in</h1>
            <div className="social-container">
              <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
              <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your account</span>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <a href="#">Forgot your password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" onClick={handleToggle}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" onClick={handleToggle}>Sign Up</button>
            </div>
          </div>
        </div>

        <footer>
          <p>
            Created with <i className="fa fa-heart"></i> by
            <a target="_blank" rel="noreferrer" href="https://florin-pop.com"> Florin Pop </a>
            - Read how I created this
            <a target="_blank" rel="noreferrer" href="https://www.florin-pop.com/blog/2019/03/double-slider-sign-in-up-form/"> here </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Login;
