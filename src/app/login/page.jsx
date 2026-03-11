"use client";
import React, { useState } from "react";
import "./page.scss";
import { setUserSession } from "@/redux/authSlice";
import axios from "axios";
import { useRouter } from 'nextjs-toploader/app';
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Link from 'next/link';

const Mail = ({ size=24, className="" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

const Lock = ({ size=24, className="" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);

const Eye = ({ size=24, className="" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
);

const EyeOff = ({ size=24, className="" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.579 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
);

const Store = ({ size=24, className="" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
);

const Activity = ({ size=24, className="" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.48 12H2"/></svg>
);

const Shield = ({ size=24, className="" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
);

const Package = ({ size=24, className="" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
);

const AlertCircle = ({ size=24, className="" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
);

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setAlertOpen(false);

    try {
      const response = await axios({
        url: process.env.NEXT_PUBLIC_API_URL + "/auth/login",
        method: 'POST',
        data: data
      });

      if (response.data.status === "Success" || response.data.success) {
        const sessionData = response.data.userSession || response.data.data;
        if (sessionData) {
            dispatch(setUserSession(sessionData));
        }
        router.push('/select-store', { scroll: false });
      } else {
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertOpen(true);
      console.error("Login Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-grid">
        {/* Left Side - Login Form */}
        <div className="login-form-panel">
          <div className="login-form-wrapper">
            <div className="login-header">
              <div className="login-logo-container">
                <Store size={40} className="brand-logo" />
              </div>
              <h1 className="welcome-text">Welcome Back</h1>
              <p className="welcome-subtext">Access your E-PDS dashboard</p>
            </div>

            <div className="login-card">
              <form onSubmit={handleSubmit(onSubmit)}>
                {alertOpen && (
                  <div className="alert-box error">
                    <AlertCircle size={20} className="alert-icon" />
                    <div>
                      <strong>Authentication Failed</strong>
                      <p>Invalid credentials. Please check your email and password.</p>
                    </div>
                  </div>
                )}
                
                <div className="input-group">
                  <div className="label-box">
                    <Mail className="input-icon" size={16} />
                    <label htmlFor="email">Email Address</label>
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className={`login-input ${errors.email ? 'input-error' : ''}`}
                    {...register("email", { required: true })}
                  />
                  {errors.email && <span className="helper-text error">Email is required</span>}
                </div>

                <div className="input-group password-group">
                  <div className="label-box">
                    <Lock className="input-icon" size={16} />
                    <label htmlFor="password">Password</label>
                  </div>
                  <div className="password-input-wrapper">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`login-input ${errors.password ? 'input-error' : ''}`}
                      {...register("password", { required: true })}
                    />
                    <button
                      type="button"
                      className="visibility-icon-btn"
                      onClick={togglePasswordVisibility}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <span className="helper-text error">Password is required</span>}
                </div>

                <div className="forgot-password-box">
                  <Link href="/ForgotPassword" className="forgot-password-link">
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`login-submit-btn ${isSubmitting ? 'loading' : ''}`}
                >
                  {isSubmitting ? "Authenticating..." : "Sign In to Dashboard"}
                </button>

                <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px" }}>
                  <span style={{ color: "#64748b" }}>Don't have an account? </span>
                  <Link href="/signup" style={{ color: "#3b82f6", fontWeight: 600, textDecoration: "none" }}>
                    Sign Up
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Side - Branding & Features */}
        <div className="branding-panel">
          <div className="branding-content-box">
            <h2 className="brand-title">E-PDS Enterprise</h2>
            <h3 className="brand-subtitle">Public Distribution System Suite</h3>
            
            <span className="pro-badge">Kerala Govt. Integrated Edition</span>

            <div className="brand-divider" />

            {/* Feature Cards */}
            <div className="features-grid">
              <div className="feature-card">
                <Store size={24} className="feature-icon" />
                <h4 className="feature-title">Store Management</h4>
                <p className="feature-desc">Ration & Supplyco Centers</p>
              </div>
              <div className="feature-card">
                <Package size={24} className="feature-icon" />
                <h4 className="feature-title">Inventory</h4>
                <p className="feature-desc">Real-time stock tracking</p>
              </div>
              <div className="feature-card">
                <Activity size={24} className="feature-icon" />
                <h4 className="feature-title">Analytics</h4>
                <p className="feature-desc">Intelligent insights summary</p>
              </div>
              <div className="feature-card">
                <Shield size={24} className="feature-icon" />
                <h4 className="feature-title">Security</h4>
                <p className="feature-desc">Enterprise-grade protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}