import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/Card/Card";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../../utils/regex";
import "./SignUpPage.css";
import { createUserAPI, type SignupRequest, type AddressDto } from "../../back-end/APITesting/User.ts";

const emptyAddress: AddressDto = {
  streetLine1: "",
  streetLine2: "",
  city: "",
  stateOrRegion: "",
  postalCode: "",
  country: "",
};

export function SignUpPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<AddressDto>({ ...emptyAddress });
  const [billingAddress, setBillingAddress] = useState<AddressDto>({ ...emptyAddress });

  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
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

  const validateUsername = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setUsernameError("Username must be at least 2 characters.");
      return false;
    }
    setUsernameError("");
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

  const toAddressPayload = (addr: AddressDto): AddressDto | undefined => {
    const a = {
      streetLine1: addr.streetLine1?.trim() || undefined,
      streetLine2: addr.streetLine2?.trim() || undefined,
      city: addr.city?.trim() || undefined,
      stateOrRegion: addr.stateOrRegion?.trim() || undefined,
      postalCode: addr.postalCode?.trim() || undefined,
      country: addr.country?.trim() || undefined,
    };
    if (!a.streetLine1 && !a.streetLine2 && !a.city && !a.stateOrRegion && !a.postalCode && !a.country) {
      return undefined;
    }
    return a;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailOK = validateEmail(email);
    const usernameOK = validateUsername(username);
    const passwordOK = validatePassword(password);

    if (!emailOK || !usernameOK || !passwordOK) {
      return;
    }

    const payload: SignupRequest = {
      email: email.trim(),
      username: username.trim(),
      password,
      role: isAdmin ? "Admin" : "User",
    };
    const shipping = toAddressPayload(shippingAddress);
    const billing = toAddressPayload(billingAddress);
    if (shipping) payload.shippingAddress = shipping;
    if (billing) payload.billingAddress = billing;

    try {
      const response = await createUserAPI(payload);
      if (response.success) {
        setSignupSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        alert("Email or username has been used.");
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

          <div className={`${usernameError ? "" : "form-group"}`}>
            <label htmlFor="signup-username" className="form-label">
              Username
            </label>
            <input
              id="signup-username"
              type="text"
              className={`form-input ${usernameError ? "invalid" : ""}`}
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && <small className="error-text">{usernameError}</small>}
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

          <div className="address-section">
            <h3 className="address-heading">Shipping address (optional)</h3>
            <div className="form-group">
              <label htmlFor="ship-line1" className="form-label">Street line 1</label>
              <input id="ship-line1" type="text" className="form-input" placeholder="123 Main St" value={shippingAddress.streetLine1 ?? ""} onChange={(e) => setShippingAddress((a) => ({ ...a, streetLine1: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="ship-line2" className="form-label">Street line 2</label>
              <input id="ship-line2" type="text" className="form-input" placeholder="Apt 4" value={shippingAddress.streetLine2 ?? ""} onChange={(e) => setShippingAddress((a) => ({ ...a, streetLine2: e.target.value }))} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ship-city" className="form-label">City</label>
                <input id="ship-city" type="text" className="form-input" placeholder="Seattle" value={shippingAddress.city ?? ""} onChange={(e) => setShippingAddress((a) => ({ ...a, city: e.target.value }))} />
              </div>
              <div className="form-group">
                <label htmlFor="ship-state" className="form-label">State / Region</label>
                <input id="ship-state" type="text" className="form-input" placeholder="WA" value={shippingAddress.stateOrRegion ?? ""} onChange={(e) => setShippingAddress((a) => ({ ...a, stateOrRegion: e.target.value }))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ship-postal" className="form-label">Postal code</label>
                <input id="ship-postal" type="text" className="form-input" placeholder="98101" value={shippingAddress.postalCode ?? ""} onChange={(e) => setShippingAddress((a) => ({ ...a, postalCode: e.target.value }))} />
              </div>
              <div className="form-group">
                <label htmlFor="ship-country" className="form-label">Country</label>
                <input id="ship-country" type="text" className="form-input" placeholder="USA" value={shippingAddress.country ?? ""} onChange={(e) => setShippingAddress((a) => ({ ...a, country: e.target.value }))} />
              </div>
            </div>
          </div>

          <div className="address-section">
            <h3 className="address-heading">Billing address (optional)</h3>
            <div className="form-group">
              <label htmlFor="bill-line1" className="form-label">Street line 1</label>
              <input id="bill-line1" type="text" className="form-input" placeholder="123 Main St" value={billingAddress.streetLine1 ?? ""} onChange={(e) => setBillingAddress((a) => ({ ...a, streetLine1: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="bill-line2" className="form-label">Street line 2</label>
              <input id="bill-line2" type="text" className="form-input" placeholder="Apt 4" value={billingAddress.streetLine2 ?? ""} onChange={(e) => setBillingAddress((a) => ({ ...a, streetLine2: e.target.value }))} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bill-city" className="form-label">City</label>
                <input id="bill-city" type="text" className="form-input" placeholder="Seattle" value={billingAddress.city ?? ""} onChange={(e) => setBillingAddress((a) => ({ ...a, city: e.target.value }))} />
              </div>
              <div className="form-group">
                <label htmlFor="bill-state" className="form-label">State / Region</label>
                <input id="bill-state" type="text" className="form-input" placeholder="WA" value={billingAddress.stateOrRegion ?? ""} onChange={(e) => setBillingAddress((a) => ({ ...a, stateOrRegion: e.target.value }))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bill-postal" className="form-label">Postal code</label>
                <input id="bill-postal" type="text" className="form-input" placeholder="98101" value={billingAddress.postalCode ?? ""} onChange={(e) => setBillingAddress((a) => ({ ...a, postalCode: e.target.value }))} />
              </div>
              <div className="form-group">
                <label htmlFor="bill-country" className="form-label">Country</label>
                <input id="bill-country" type="text" className="form-input" placeholder="USA" value={billingAddress.country ?? ""} onChange={(e) => setBillingAddress((a) => ({ ...a, country: e.target.value }))} />
              </div>
            </div>
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
