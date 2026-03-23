"use client";
import React, { useState } from "react";
import "../login/page.scss";
import { setUserSession } from "@/redux/authSlice";
import axios from "axios";
import { useRouter } from 'nextjs-toploader/app';
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Link from 'next/link';

const User = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

const Mail = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
);

const Lock = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);

const Eye = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
);

const EyeOff = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.579 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" /></svg>
);

const Store = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></svg>
);

const Activity = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.48 12H2" /></svg>
);

const Shield = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>
);

const Package = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
);

const AlertCircle = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
);

export default function Signup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ open: false, type: 'error', message: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");
  const localBodyType = watch("localBodyType");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setAlertInfo({ open: false, type: 'error', message: '' });

    try {
      const response = await axios({
        url: process.env.NEXT_PUBLIC_API_URL + "/auth/signup",
        method: 'POST',
        data: {
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          talukName: data.talukName,
          address: data.address,
          localBodyType: data.localBodyType,
          localBodyName: data.localBodyName,
          wardNo: data.wardNo,
          eligibleMembers: data.eligibleMembers,
          annualIncome: data.annualIncome
        }
      });

      if (response.data.status === "Success" || response.data.success) {
        // Automatically login the user if session is returned
        const sessionData = response.data.userSession || response.data.data;
        if (sessionData) {
          dispatch(setUserSession(sessionData));
          router.push('/select-store', { scroll: false });
        } else {
          // Otherwise redirect to login
          router.push('/login', { scroll: false });
        }
      } else {
        setAlertInfo({ open: true, type: 'error', message: response.data.message || "Registration failed. Email might already exist." });
      }
    } catch (error) {
      setAlertInfo({
        open: true,
        type: 'error',
        message: error.response?.data?.message || "Something went wrong during registration."
      });
      console.error("Signup Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-grid">
        {/* Left Side - Brands */}
        <div className="branding-panel" style={{ order: 0 }}>
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

        {/* Right Side - Signup Form */}
        <div className="login-form-panel" style={{ order: 1 }}>
          <div className="login-form-wrapper">
            <div className="login-header">
              <div className="login-logo-container">
                <Store size={40} className="brand-logo" />
              </div>
              <h1 className="welcome-text">Create Account</h1>
              <p className="welcome-subtext">Join the E-PDS Management Suite</p>
            </div>

            <div className="login-card">
              <form onSubmit={handleSubmit(onSubmit)}>
                {alertInfo.open && (
                  <div className={`alert-box ${alertInfo.type}`}>
                    <AlertCircle size={20} className="alert-icon" />
                    <div>
                      <strong>Action Failed</strong>
                      <p>{alertInfo.message}</p>
                    </div>
                  </div>
                )}

                <div className="input-group" style={{ marginBottom: "16px" }}>
                  <div className="label-box">
                    <User className="input-icon" size={16} />
                    <label htmlFor="fullName">Full Name</label>
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className={`login-input ${errors.fullName ? 'input-error' : ''}`}
                    {...register("fullName", { required: true })}
                  />
                  {errors.fullName && <span className="helper-text error">Full name is required</span>}
                </div>

                <div className="input-group" style={{ marginBottom: "16px" }}>
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
                <div className="input-group" style={{ marginBottom: "16px" }}>
                  <div className="label-box">
                    <label htmlFor="address">Full Address *</label>
                  </div>
                  <textarea
                    id="address"
                    placeholder="Enter your residential address"
                    className={`login-input ${errors.address ? 'input-error' : ''}`}
                    style={{ minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' }}
                    {...register("address", { required: true })}
                  />
                  {errors.address && <span className="helper-text error">Address is required</span>}
                </div>

                <div className="form-row" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div className="input-group" style={{ flex: 1 }}>
                    <div className="label-box">
                      <label htmlFor="talukName">Taluk Name *</label>
                    </div>
                    <input
                      id="talukName"
                      type="text"
                      placeholder="Enter Taluk"
                      className={`login-input ${errors.talukName ? 'input-error' : ''}`}
                      {...register("talukName", { required: true })}
                    />
                    {errors.talukName && <span className="helper-text error">Required</span>}
                  </div>

                  <div className="input-group" style={{ flex: 1 }}>
                    <div className="label-box">
                      <label htmlFor="localBodyType">Local Body Type *</label>
                    </div>
                    <select
                      id="localBodyType"
                      className={`login-input ${errors.localBodyType ? 'input-error' : ''}`}
                      style={{ appearance: 'auto', backgroundColor: '#fff' }}
                      {...register("localBodyType", { required: true })}
                    >
                      <option value="">Select type</option>
                      <option value="panchayat">Panchayat</option>
                      <option value="municipality">Municipality</option>
                      <option value="corporation">Corporation</option>
                    </select>
                    {errors.localBodyType && <span className="helper-text error">Required</span>}
                  </div>
                </div>

                {localBodyType && (
                  <div className="input-group" style={{ marginBottom: "16px" }}>
                    <div className="label-box">
                      <label htmlFor="localBodyName">{localBodyType.charAt(0).toUpperCase() + localBodyType.slice(1)} Name *</label>
                    </div>
                    <input
                      id="localBodyName"
                      type="text"
                      placeholder={`Enter ${localBodyType} name`}
                      className={`login-input ${errors.localBodyName ? 'input-error' : ''}`}
                      {...register("localBodyName", { required: true })}
                    />
                    {errors.localBodyName && <span className="helper-text error">Required</span>}
                  </div>
                )}

                <div className="form-row" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div className="input-group" style={{ flex: 1 }}>
                    <div className="label-box">
                      <label htmlFor="wardNo">Ward number *</label>
                    </div>
                    <input
                      id="wardNo"
                      type="text"
                      placeholder="Enter ward no"
                      className={`login-input ${errors.wardNo ? 'input-error' : ''}`}
                      {...register("wardNo", { required: true })}
                    />
                    {errors.wardNo && <span className="helper-text error">Required</span>}
                  </div>

                  <div className="input-group" style={{ flex: 1 }}>
                    <div className="label-box">
                      <label htmlFor="annualIncome">Annual Income (₹) *</label>
                    </div>
                    <input
                      id="annualIncome"
                      type="number"
                      placeholder="e.g. 150000"
                      className={`login-input ${errors.annualIncome ? 'input-error' : ''}`}
                      {...register("annualIncome", { required: true, min: 0 })}
                    />
                    {errors.annualIncome && <span className="helper-text error">Required</span>}
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: "16px" }}>
                  <div className="label-box">
                    <label htmlFor="eligibleMembers">Number of members eligible for ration</label>
                  </div>
                  <input
                    id="eligibleMembers"
                    type="number"
                    placeholder="e.g. 4"
                    className={`login-input ${errors.eligibleMembers ? 'input-error' : ''}`}
                    {...register("eligibleMembers", { required: true, min: 1 })}
                  />
                  {errors.eligibleMembers && <span className="helper-text error">Required</span>}
                  <span className="helper-text" style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>Enter the total number of family members eligible for ration items.</span>
                </div>
                <div className="input-group password-group" style={{ marginBottom: "16px" }}>
                  <div className="label-box">
                    <Lock className="input-icon" size={16} />
                    <label htmlFor="password">Password</label>
                  </div>
                  <div className="password-input-wrapper">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className={`login-input ${errors.password ? 'input-error' : ''}`}
                      {...register("password", { required: true, minLength: 6 })}
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
                  {errors.password?.type === 'required' && <span className="helper-text error">Password is required</span>}
                  {errors.password?.type === 'minLength' && <span className="helper-text error">Password must be at least 6 characters</span>}
                </div>

                <div className="input-group password-group">
                  <div className="label-box">
                    <Lock className="input-icon" size={16} />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                  </div>
                  <div className="password-input-wrapper">
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className={`login-input ${errors.confirmPassword ? 'input-error' : ''}`}
                      {...register("confirmPassword", {
                        required: true,
                        validate: value => value === password || "Passwords do not match"
                      })}
                    />
                  </div>
                  {errors.confirmPassword && <span className="helper-text error">{errors.confirmPassword.message || "Please confirm your password"}</span>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`login-submit-btn ${isSubmitting ? 'loading' : ''}`}
                  style={{ marginTop: "16px" }}
                >
                  {isSubmitting ? "Creating Account..." : "Sign Up Securely"}
                </button>

                <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px" }}>
                  <span style={{ color: "#64748b" }}>Already have an account? </span>
                  <Link href="/login" style={{ color: "#3b82f6", fontWeight: 600, textDecoration: "none" }}>
                    Sign In instead
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
