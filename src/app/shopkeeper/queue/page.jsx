"use client";

import React, { useState, useEffect } from "react";
import useAuthAxios from "@/hooks/useAuthAxios";
import "./page.scss";

// Icons
const Check = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);

const X = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
);

const User = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export default function ShopkeeperQueuePage() {
    const authAxios = useAuthAxios();
    const [stores, setStores] = useState([]);
    const [selectedStoreId, setSelectedStoreId] = useState("");
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchStores();
    }, []);

    useEffect(() => {
        if (selectedStoreId) {
            fetchBookings();
        }
    }, [selectedStoreId, date]);

    const fetchStores = async () => {
        try {
            const res = await authAxios.get("/api/stores");
            if (res.data.success) {
                setStores(res.data.data);
                if (res.data.data.length > 0) setSelectedStoreId(res.data.data[0]._id);
            }
        } catch (err) {
            console.error("Failed to fetch stores:", err);
        }
    };

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await authAxios.get(`/api/queue/store-bookings?storeId=${selectedStoreId}&date=${date}`);
            if (res.data.success) {
                setBookings(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId, status) => {
        try {
            const res = await authAxios.patch("/api/queue/update-status", {
                bookingId,
                status
            });
            if (res.data.success) {
                fetchBookings();
            }
        } catch (err) {
            alert("Failed to update status");
        }
    };

    return (
        <div className="shopkeeper-queue-container">
            <header className="page-header">
                <div className="title-area">
                    <h1>Queue Management</h1>
                    <p>Approve and manage customer visits</p>
                </div>
                
                <div className="filters">
                    <div className="filter-group">
                        <label>Store</label>
                        <select value={selectedStoreId} onChange={(e) => setSelectedStoreId(e.target.value)}>
                            {stores.map(s => (
                                <option key={s._id} value={s._id}>{s.shopName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Date</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                </div>
            </header>

            <div className="bookings-grid">
                {loading ? (
                    <div className="loading-state">Loading bookings...</div>
                ) : bookings.length === 0 ? (
                    <div className="empty-state">No bookings for this date.</div>
                ) : (
                    <div className="bookings-table-wrapper">
                        <table className="bookings-table">
                            <thead>
                                <tr>
                                    <th>Token</th>
                                    <th>Customer</th>
                                    <th>Slot</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr key={booking._id}>
                                        <td className="token">#{booking.tokenNumber}</td>
                                        <td className="customer">
                                            <div className="cust-info">
                                                <div className="name">{booking.user?.fullName}</div>
                                                <div className="email">{booking.user?.email}</div>
                                            </div>
                                        </td>
                                        <td className="slot">
                                            <span className={`slot-tag ${booking.timeSlot.toLowerCase()}`}>
                                                {booking.timeSlot}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-pill ${booking.status}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="actions">
                                            {booking.status === 'pending' && (
                                                <>
                                                    <button 
                                                        className="action-btn approve" 
                                                        onClick={() => handleStatusUpdate(booking._id, 'approved')}
                                                        title="Approve"
                                                    >
                                                        <Check />
                                                    </button>
                                                    <button 
                                                        className="action-btn reject" 
                                                        onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                                                        title="Reject"
                                                    >
                                                        <X />
                                                    </button>
                                                </>
                                            )}
                                            {booking.status === 'approved' && (
                                                <button 
                                                    className="action-btn complete" 
                                                    onClick={() => handleStatusUpdate(booking._id, 'completed')}
                                                >
                                                    Mark Completed
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
