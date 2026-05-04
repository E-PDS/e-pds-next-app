"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import useAuthAxios from "@/hooks/useAuthAxios";
import "./page.scss";

// Icons
const ChevronLeft = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
);

const Calendar = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);

const Clock = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const CheckCircle = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

export default function QueueBookingPage() {
    const router = useRouter();
    const authAxios = useAuthAxios();
    const { user } = useSelector(state => state.auth);
    const { selectedStore } = useSelector(state => state.shop);

    const [date, setDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("Morning");
    const [availability, setAvailability] = useState(null);
    const [myBookings, setMyBookings] = useState([]);
    const [stores, setStores] = useState([]);
    const [selectedStoreId, setSelectedStoreId] = useState("");
    const [loading, setLoading] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [minDateStr, setMinDateStr] = useState("");

    useEffect(() => {
        fetchStores();
        fetchMyBookings();

        // Minimum date is tomorrow
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 1);
        setMinDateStr(minDate.toISOString().split('T')[0]);
    }, []);

    useEffect(() => {
        if (selectedStore && !selectedStoreId) {
            setSelectedStoreId(selectedStore._id || selectedStore.id);
        }
    }, [selectedStore]);

    useEffect(() => {
        if (date && selectedStoreId) {
            fetchAvailability();
        }
    }, [date, selectedStoreId]);

    const fetchStores = async () => {
        try {
            const res = await authAxios.get("/api/stores");
            if (res.data.success) {
                setStores(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch stores:", err);
        }
    };

    const fetchAvailability = async () => {
        try {
            const res = await authAxios.get(`/api/queue/slots?storeId=${selectedStoreId}&date=${date}`);
            if (res.data.success) {
                setAvailability(res.data.availability);
            }
        } catch (err) {
            console.error("Failed to fetch availability:", err);
        }
    };

    const fetchMyBookings = async () => {
        if (!user?.userId) return;
        setLoading(true);
        try {
            const res = await authAxios.get(`/api/queue/user-bookings?userId=${user.userId}`);
            if (res.data.success) {
                setMyBookings(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!date || !timeSlot) return;

        setBookingLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await authAxios.post("/api/queue/book", {
                storeId: selectedStoreId,
                userId: user.userId,
                date,
                timeSlot
            });

            if (res.data.success) {
                setMessage({ type: "success", text: res.data.message });
                fetchMyBookings();
                fetchAvailability();
            }
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to book queue." });
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <div className="queue-page-container">
            <header className="header">
                <button className="back-btn" onClick={() => router.push("/options")}>
                    <ChevronLeft />
                </button>
                <div className="title-section">
                    <h1>Virtual Queue</h1>
                    <p>Book your visit to the registered stores</p>
                </div>
            </header>

            <div className="booking-grid">
                {/* Rules Section */}
                <div className="queue-rules">
                    <div className="rule">
                        <div className="rule-icon"><Calendar /></div>
                        <div className="rule-text">
                            <h4>Availability</h4>
                            <p>Monday to Saturday. Closed on Sundays & Holidays.</p>
                        </div>
                    </div>
                    <div className="rule">
                        <div className="rule-icon"><Clock /></div>
                        <div className="rule-text">
                            <h4>Time Sections</h4>
                            <p>Morning: 8AM - 12PM | Evening: 4PM - 7PM</p>
                        </div>
                    </div>
                    <div className="rule">
                        <div className="rule-icon"><CheckCircle /></div>
                        <div className="rule-text">
                            <h4>Limited Slots</h4>
                            <p>Only 20 slots available per day per shop.</p>
                        </div>
                    </div>
                </div>

                {/* Booking Form */}
                <div className="card booking-form-card">
                    <h2><Calendar /> Book a Slot</h2>
                    <form className="booking-form" onSubmit={handleBooking}>
                        <div className="input-group">
                            <label>Select Shop</label>
                            <select 
                                value={selectedStoreId} 
                                onChange={(e) => {
                                    setSelectedStoreId(e.target.value);
                                    setAvailability(null); // Reset availability when shop changes
                                }}
                                required
                            >
                                <option value="" disabled>Choose a shop</option>
                                {stores.map(store => (
                                    <option key={store._id} value={store._id}>
                                        {store.shopName} {store.shopAddress ? `(${store.shopAddress})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Select Date</label>
                            <input 
                                type="date" 
                                min={minDateStr} 
                                value={date}
                                onChange={(e) => {
                                    const selectedDate = new Date(e.target.value);
                                    if (selectedDate.getDay() === 0) {
                                        setMessage({ type: "error", text: "Virtual queue is not available on Sundays." });
                                        setDate("");
                                    } else {
                                        setDate(e.target.value);
                                        setMessage({ type: "", text: "" });
                                    }
                                }}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Time Section</label>
                            <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                                <option value="Morning">Morning (8 AM - 12 PM)</option>
                                <option value="Evening">Evening (4 PM - 7 PM)</option>
                            </select>
                        </div>

                        {availability && (
                            <div className="availability-info">
                                <div className="slots-status">
                                    <div className="label">Available Slots for the Day</div>
                                    <div className="remaining">{availability.remainingSlots} / 20</div>
                                </div>
                            </div>
                        )}

                        {message.text && (
                            <div className={`message-alert ${message.type}`} style={{ 
                                padding: '1rem', 
                                borderRadius: '8px', 
                                marginBottom: '1.5rem',
                                background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                                color: message.type === 'success' ? '#166534' : '#991b1b',
                                fontSize: '0.875rem'
                            }}>
                                {message.text}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className={`book-btn ${bookingLoading ? 'loading' : ''}`}
                            disabled={bookingLoading || (availability && availability.remainingSlots <= 0)}
                        >
                            {bookingLoading ? "Booking..." : "Confirm Booking"}
                        </button>
                    </form>
                </div>

                {/* My Bookings */}
                <div className="card my-bookings">
                    <h2><Clock /> My Bookings</h2>
                    {loading ? (
                        <div className="empty-state">Loading your bookings...</div>
                    ) : myBookings.length === 0 ? (
                        <div className="empty-state">
                            <div className="icon">🎫</div>
                            <p>No active queue bookings found.</p>
                        </div>
                    ) : (
                        <div className="bookings-list">
                            {myBookings.map((booking) => (
                                <div key={booking._id} className="booking-item">
                                    <div className="main-info">
                                        <div className="date">{new Date(booking.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
                                        <div className="store">{booking.store?.shopName}</div>
                                        <div className="slot">{booking.timeSlot} Section</div>
                                    </div>
                                    <div className="token-info">
                                        <span className="token-label">Token No.</span>
                                        <div className="token-value">#{booking.tokenNumber}</div>
                                        <div className={`status-badge ${booking.status}`}>
                                            {booking.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
