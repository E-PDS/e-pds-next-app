"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import useAuthAxios from "@/hooks/useAuthAxios";
import "./page.scss";

// Lucide-like SVG Icons
const Package = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
    </svg>
);

const Clock = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
);

const CheckCircle = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
);

const ChevronRight = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m9 18 6-6-6-6"/>
    </svg>
);

const ShoppingBag = ({ size = 64, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
);

export default function OrdersPage() {
    const user = useSelector(state => state.auth.user);
    const authAxios = useAuthAxios();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await authAxios.get('/api/orders');
                if (response && response.data && response.data.success) {
                    setOrders(response.data.data);
                } else {
                    setError("Failed to fetch orders.");
                }
            } catch (err) {
                console.error("Fetch orders error", err);
                setError(err.response?.data?.message || "Something went wrong fetching orders.");
            } finally {
                setLoading(false);
            }
        };

        if (user?.sessionToken) {
            fetchOrders();
        } else {
            // Wait for user session or redirect if definitely not logged in
            const timeout = setTimeout(() => {
                if (loading) setLoading(false);
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [authAxios, user, loading]);

    const getStatusInfo = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'pending': return { label: 'Processing', class: 'status-pending', icon: <Clock size={14} /> };
            case 'paid': return { label: 'Paid & Processing', class: 'status-paid', icon: <CheckCircle size={14} /> };
            case 'completed': return { label: 'Order Completed', class: 'status-completed', icon: <CheckCircle size={14} /> };
            case 'cancelled': return { label: 'Cancelled', class: 'status-cancelled', icon: null };
            default: return { label: status || 'Pending', class: 'status-default', icon: null };
        }
    };

    if (loading) {
        return (
            <div className="orders-loading">
                <div className="pulse-loader"></div>
                <p>Retrieving your orders...</p>
            </div>
        );
    }

    return (
        <div className="orders-page-container">
            <header className="orders-header">
                <div className="header-text">
                    <h1>My Purchase History</h1>
                    <p>Track and manage your recent PDS orders</p>
                </div>
                <div className="order-stats">
                    <div className="stat-card">
                        <span className="stat-value">{orders.length}</span>
                        <span className="stat-label">Total Orders</span>
                    </div>
                </div>
            </header>

            {error && <div className="error-alert">{error}</div>}

            {orders.length === 0 ? (
                <div className="empty-orders">
                    <div className="empty-icon-bg">
                        <ShoppingBag className="empty-icon" />
                    </div>
                    <h2>No orders found yet</h2>
                    <p>Start shopping to see your purchase history here.</p>
                    <button onClick={() => router.push('/options')} className="shop-now-btn">
                        Explore Stores
                    </button>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => {
                        const statusInfo = getStatusInfo(order.status);
                        const date = new Date(order.createdAt);
                        
                        return (
                            <div key={order._id} className="order-card-premium">
                                <div className="order-card-header">
                                    <div className="order-id-group">
                                        <Package className="pkg-icon" size={20} />
                                        <div>
                                            <span className="order-id-label">Order ID</span>
                                            <h3 className="order-id-value">#{order._id?.substring(order._id.length - 8).toUpperCase()}</h3>
                                        </div>
                                    </div>
                                    <div className={`status-badge-premium ${statusInfo.class}`}>
                                        {statusInfo.icon}
                                        <span>{statusInfo.label}</span>
                                    </div>
                                </div>

                                <div className="order-card-body">
                                    <div className="order-info-grid">
                                        <div className="info-item">
                                            <span className="info-label">Date</span>
                                            <span className="info-value">
                                                {isNaN(date.getTime()) 
                                                    ? 'Recent Order' 
                                                    : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Items</span>
                                            <span className="info-value">{order.items?.length || 0} Products</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Total Amount</span>
                                            <span className="info-value price">₹{order.totalAmount}</span>
                                        </div>
                                    </div>

                                    <div className="order-items-preview">
                                        {order.items?.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="preview-dot"></div>
                                        ))}
                                        {order.items?.length > 3 && <span className="more-items">+{order.items.length - 3} more</span>}
                                    </div>
                                </div>

                                <div className="order-card-footer">
                                    <div className="delivery-summary">
                                        <span className="delivery-to">Delivering to</span>
                                        <span className="delivery-city">{order.deliveryAddress?.city || 'Registered Address'}</span>
                                    </div>
                                    <button className="view-details-btn">
                                        View Details <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
