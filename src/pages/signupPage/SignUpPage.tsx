import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/Card/Card";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../../utils/regex";
import "./SignUpPage.css";
import { createUserAPI, type UserData } from "../../back-end/APITesting/User.ts";

export function SignUpPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleClose = () => {
    navigate(-1);
  };

  const validateEmail = (value: string) => {
    if (!EMAIL_REGEX.test(value)) {
      setEmailError("Invalid email input!");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (value: string) => {
    if (!PASSWORD_REGEX.test(value)) {
      setPasswordError("Invalid password input!");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailOK = validateEmail(email);
    const passwordOK = validatePassword(password);

    if (!emailOK || !passwordOK) {
      return;
    }

    const userData: UserData = {
      email: email,
      password: password,
      role: isAdmin ? "Admin" : "User",
    };

    try {
      // BACKEND (Spring Boot): POST `/api/auth/signup`
      const response = await createUserAPI(userData);
      if (response.success) {
        setSignupSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        alert("Email has been used.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <Card handleClose={handleClose}>
      <div className="signup-container">
        {signupSuccess && (
          <div className="success-popup">
            🎉 Account created! Redirecting to login page...
          </div>
        )}
        <h2 className="signup-title">Sign up an account</h2>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className={`${emailError ? "" : "form-group"}`}>
            <label htmlFor="signup-email" className="form-label">
              Email
            </label>
            <input
              id="signup-email"
              type="text"
              className={`form-input ${emailError ? "invalid" : ""}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <small className="error-text">{emailError}</small>}
          </div>

          <div className={`${passwordError ? "" : "form-group"}`}>
            <label htmlFor="signup-password" className="form-label">
              Password
            </label>
            <div className="password-wrapper">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                className={`form-input ${passwordError ? "invalid" : ""}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="show-button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {passwordError && (
              <small className="error-text">{passwordError}</small>
            )}
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="form-checkbox"
              />
              Is Admin?
            </label>
          </div>

          <button type="submit" className="submit-button">
            Create account
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </Card>
  );
}
