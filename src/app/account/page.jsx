"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/authSlice";
import "./page.scss";

// Lucide Icons as Inline SVGs
const Icons = {
    User: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    ),
    CreditCard: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
    ),
    LogOut: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
    ),
    MapPin: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    ),
    Calendar: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
    ),
    ShieldCheck: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
    ),
    AlertCircle: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
    ),
    Sparkles: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
    )
};

export default function Account() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const router = useRouter();

    const [eCard, setECard] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        const fetchData = async () => {
            try {
                const config = {
                    headers: { sessiontoken: user.sessionToken }
                };

                // Fetch Profile and E-Card in parallel
                const [profileRes, eCardRes] = await Promise.all([
                    axios.post("/api/user/profile", { userId: user.userId }, config),
                    axios.post("/api/user/e-card", { userId: user.userId }, config).catch(() => null)
                ]);

                if (profileRes.data.status === "Success") {
                    setProfile(profileRes.data.data);
                }

                if (eCardRes && eCardRes.data.status === "Success") {
                    setECard(eCardRes.data.data);
                }
            } catch (error) {
                console.error("Error fetching account data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, router]);

    const handleGenerateCard = async () => {
        if (!user?.userId) return;
        setGenerating(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
            const config = {
                headers: { sessiontoken: user.sessionToken }
            };
            const res = await axios.post(apiUrl + "/user/generate-e-card", { userId: user.userId }, config);
            if (res.data.status === "Success") {
                setECard(res.data.data);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Failed to generate E-Card. Please try again later.";
            alert(errorMsg);
        } finally {
            setGenerating(false);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="account-loading">
                <div className="spinner"></div>
                <p>Authenticating & Loading Profile...</p>
            </div>
        );
    }

    return (
        <div className="account-container">
            <header className="page-header">
                <div className="header-content">
                    <div className="title-section">
                        <h1>My Account</h1>
                        <p>Digital Identity & E-PDS Profile</p>
                    </div>
                    <button className="logout-btn" onClick={handleLogout} title="Sign Out">
                        <Icons.LogOut />
                        <span>Sign Out</span>
                    </button>
                </div>
            </header>

            <main className="account-main">
                <section className="profile-hero">
                    <div className="user-avatar">
                        <Icons.User />
                    </div>
                    <div className="user-info">
                        <h2>{profile?.fullName || user?.fullName || "Verified User"}</h2>
                        <p className="user-email">{profile?.email || "..."}</p>
                        <div className="verification-badge">
                            <Icons.ShieldCheck />
                            <span>Active Member</span>
                        </div>
                    </div>
                </section>

                <div className="content-grid">
                    {/* E-Card Section */}
                    <section className="card-section">
                        <div className="section-header">
                            <Icons.CreditCard />
                            <h3>Digital E-Card</h3>
                        </div>

                        {eCard ? (
                            <div className={`premium-ecard color-${eCard.color}`}>
                                <div className="card-top">
                                    <div className="pds-brand">
                                        <span className="logo-dot"></span>
                                        E-PDS KERALA
                                    </div>
                                    <div className="card-badge">{eCard.priority}</div>
                                </div>
                                
                                <div className="card-type-display">
                                    <span className="color-label">{eCard.color} Card</span>
                                    <span className="type-code">{eCard.type}</span>
                                </div>

                                <div className="card-number-display">
                                    {eCard.cardNumber.match(/.{1,4}/g).join(' ')}
                                </div>

                                <div className="card-footer">
                                    <div className="card-holder">
                                        <label>CARD HOLDER</label>
                                        <p>{eCard.fullName}</p>
                                    </div>
                                    <div className="card-expiry">
                                        <label>ISSUED ON</label>
                                        <p>{new Date(eCard.issuedDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                
                                {/* Holographic effect overlay */}
                                <div className="hologram"></div>
                            </div>
                        ) : (
                            <div className="empty-card-state">
                                <div className="empty-icon">
                                    <Icons.AlertCircle />
                                </div>
                                <h4>No E-Card Issued</h4>
                                <p>Your digital ration card hasn't been generated for this profile yet.</p>
                                <button 
                                    className="generate-btn" 
                                    onClick={handleGenerateCard}
                                    disabled={generating}
                                >
                                    {generating ? (
                                        "Generating..."
                                    ) : (
                                        <>
                                            <Icons.Sparkles />
                                            <span>Generate E-Card Now</span>
                                        </>
                                    )}
                                </button>
                                <div className="eligibility-hint">
                                    * Card type determined by annual income
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Profile Details Section */}
                    <section className="details-section">
                        <div className="section-header">
                            <Icons.User />
                            <h3>Profile Details</h3>
                        </div>
                        
                        <div className="details-card">
                            <div className="detail-item">
                                <Icons.MapPin />
                                <div className="item-content">
                                    <label>Location</label>
                                    <p>{eCard?.talukName || profile?.talukName || "Loading..."}</p>
                                    <span>Ward {eCard?.wardNo || profile?.wardNo || "--"}, {eCard?.localBodyName || profile?.localBodyName || "--"}</span>
                                </div>
                            </div>
                            
                            <div className="detail-item">
                                <Icons.Calendar />
                                <div className="item-content">
                                    <label>Family Details</label>
                                    <p>{eCard?.eligibleMembers || profile?.eligibleMembers || "0"} Eligible Members</p>
                                </div>
                            </div>

                            <div className="stats-row">
                                <div className="stat-box">
                                    <label>Annual Income</label>
                                    <p>₹{(eCard?.annualIncome || profile?.annualIncome || 0).toLocaleString()}</p>
                                </div>
                                <div className="stat-box">
                                    <label>Account Status</label>
                                    <p className="status-active">Active</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
