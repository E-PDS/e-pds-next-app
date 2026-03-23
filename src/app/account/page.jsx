"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/authSlice";
import "./page.scss";

export default function Account() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const router = useRouter();

    const [eCard, setECard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        const fetchECard = async () => {
            try {
                const res = await axios.post((process.env.NEXT_PUBLIC_API_URL || "/api") + "/user/e-card", { userId: user.userId });
                if (res.data.status === "Success") {
                    setECard(res.data.data);
                }
            } catch (error) {
                console.error("No E-Card found.", error);
            } finally {
                setLoading(false);
            }
        };

        fetchECard();
    }, [user, router]);

    const handleLogout = () => {
        dispatch(logout());
        router.push("/login");
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your details...</div>;
    }

    return (
        <div className="account-container">
            <div className="header">
                <h1>My Account</h1>
                <p>Digital E-Card & Profile</p>
            </div>

            {eCard ? (
                <div className={`ecard-wrapper color-${eCard.color}`}>
                    <div className="ecard-title">
                        <span>{eCard.color} Card - {eCard.type}</span>
                        <span className="badge">{eCard.priority}</span>
                    </div>
                    <div className="ecard-number">
                        {eCard.cardNumber}
                    </div>
                    <div className="ecard-details">
                        <div className="detail-group">
                            <span>Holder Name</span>
                            <strong>{eCard.fullName}</strong>
                        </div>
                        <div className="detail-group">
                            <span>Eligible Members</span>
                            <strong>{eCard.eligibleMembers}</strong>
                        </div>
                        <div className="detail-group">
                            <span>Taluk</span>
                            <strong>{eCard.talukName}</strong>
                        </div>
                        <div className="detail-group">
                            <span>Ward No.</span>
                            <strong>{eCard.wardNo}</strong>
                        </div>
                        <div className="detail-group">
                            <span>Annual Income</span>
                            <strong>₹{eCard.annualIncome.toLocaleString()}</strong>
                        </div>
                        <div className="detail-group">
                            <span>Issue Date</span>
                            <strong>{new Date(eCard.issuedDate).toLocaleDateString()}</strong>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    No E-Card issued yet.
                </div>
            )}

            <div className="actions">
                <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
            </div>
        </div>
    );
}
