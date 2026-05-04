"use client";

import React from "react";
import { useRouter } from "next/navigation";
import "./page.scss";

// Lucide-like SVG Icons
const ShoppingCart = ({ size = 64, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.56-7.43H5.12"/>
    </svg>
);

const UsersQueue = ({ size = 64, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
);

const Clock = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
);

const ArrowRight = ({ size = 20, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
);

export default function OptionsPage() {
    const router = useRouter();

    const handleShoppingClick = () => {
        router.push("/select-store");
    };

    const handleQueueClick = () => {
        // Placeholder for now as requested
        alert("Virtual Queue details will be updated later.");
    };

    return (
        <div className="options-page-container">
            {/* Background blobs for depth */}
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>
            <div className="bg-blob blob-3"></div>

            <div className="options-content">
                <header className="options-header">
                    <h1>Choose an Option</h1>
                    <p>How would you like to get started?</p>
                    <div className="header-divider">
                        <span className="divider-line"></span>
                        <span className="divider-dot"></span>
                    </div>
                </header>

                <div className="options-grid">
                    {/* Shopping Card */}
                    <div className="option-card shopping" onClick={handleShoppingClick}>
                        <div className="card-top-accent"></div>
                        <div className="icon-container">
                            <div className="icon-bg">
                                <ShoppingCart size={48} className="main-icon" />
                                <div className="sparkle sp-1">✦</div>
                                <div className="sparkle sp-2">✦</div>
                                <div className="sparkle sp-3">✦</div>
                            </div>
                        </div>
                        <div className="card-body">
                            <h2>Shopping</h2>
                            <p>Browse stores and shop your favorite products</p>
                            <div className="sub-options">
                                <span className="sub-tag">Ration Store</span>
                                <span className="sub-tag">Supplyco</span>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button className="action-btn">
                                <ArrowRight />
                            </button>
                        </div>
                    </div>

                    {/* Virtual Queue Card */}
                    <div className="option-card queue" onClick={handleQueueClick}>
                        <div className="card-top-accent"></div>
                        <div className="icon-container">
                            <div className="icon-bg">
                                <div className="queue-icon-wrapper">
                                    <Clock size={24} className="clock-icon" />
                                    <UsersQueue size={48} className="main-icon" />
                                </div>
                                <div className="queue-indicator">
                                    <span className="dot"></span>
                                    <span className="line"></span>
                                    <span className="dot"></span>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <h2>Virtual Queue</h2>
                            <p>Join a queue remotely and save your time</p>
                        </div>
                        <div className="card-footer">
                            <button className="action-btn">
                                <ArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle floating dots in background */}
            <div className="floating-dots dots-1"></div>
            <div className="floating-dots dots-2"></div>
        </div>
    );
}
