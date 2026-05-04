"use client";
import React, { useState, useEffect } from "react";
import "./page.scss";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "@/redux/cartSlice";
import useAuthAxios from "@/hooks/useAuthAxios";
import { Dialog, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Script from "next/script";

// Lucide-like SVG Icons
const ChevronLeft = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6" /></svg>
);

const User = ({ size = 20, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const Phone = ({ size = 20, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);

const MapPin = ({ size = 20, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
);

const CreditCard = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
);

export default function CheckoutPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const authAxios = useAuthAxios();

    const userSession = useSelector(state => state.auth.user);
    const selectedStore = useSelector(state => state.shop.selectedStore);

    const cartItems = useSelector((state) => {
        const activeTab = state.cart.tabs.find((t) => t.id === state.cart.activeTabId);
        return activeTab ? activeTab.items : [];
    });

    const totalPrice = cartItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    const [address, setAddress] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "Kerala",
        pincode: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [profileLoaded, setProfileLoaded] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("online");
    const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
    const [completedOrder, setCompletedOrder] = useState(null);

    // Load profile
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userSession?.userId || profileLoaded) return;

            try {
                const response = await authAxios.post('/api/user/profile', { userId: userSession.userId });
                if (response?.data?.status === "Success") {
                    const profile = response.data.data;
                    setAddress(prev => ({
                        ...prev,
                        fullName: profile.fullName || "",
                        addressLine1: profile.address || "",
                        addressLine2: `${profile.localBodyName || ""}, Ward ${profile.wardNo || ""}`,
                        city: profile.talukName || "",
                        phone: profile.phone || ""
                    }));
                    setProfileLoaded(true);
                }
            } catch (err) {
                console.error("Profile fetch failed", err);
            }
        };
        fetchUserProfile();
    }, [userSession?.userId, authAxios, profileLoaded]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const sanitized = value.replace(/[^0-9]/g, '').slice(0, 10);
            setAddress({ ...address, [name]: sanitized });
        } else {
            setAddress({ ...address, [name]: value });
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handlePlaceOrder = async (e) => {
        if (e) e.preventDefault();

        if (!selectedStore) return setError("No store selected");
        if (cartItems.length === 0) return setError("Cart is empty");
        if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.pincode) {
            return setError("Please fill in all required address fields.");
        }

        if (isNaN(totalPrice) || totalPrice <= 0) {
            return setError("Invalid total amount. Please check your cart.");
        }

        setLoading(true);
        setError("");

        try {
            // 1. Create Internal Order
            const orderRes = await authAxios.post("/api/orders", {
                storeId: selectedStore._id || selectedStore.id,
                items: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    unit: item.selectedUnit || "default",
                    price: item.price,
                    total: item.price * item.quantity
                })),
                totalAmount: totalPrice,
                deliveryAddress: address,
            });

            if (!orderRes.data.success) {
                throw new Error(orderRes.data.message || "Failed to create order");
            }

            const internalOrderId = orderRes.data.orderId;
            const currentOrderDetails = {
                orderId: internalOrderId,
                items: [...cartItems],
                totalAmount: totalPrice,
                paymentMethod: paymentMethod === 'online' ? 'Online' : 'Cash on Delivery'
            };

            // 2. Handle Payment
            if (paymentMethod === 'cod') {
                dispatch(clearCart());
                setCompletedOrder(currentOrderDetails);
                setShowSuccessDialog(true);
                return;
            }

            // Online Payment
            const razorRes = await authAxios.post("/api/create-order", {
                amount: totalPrice,
                userId: userSession?.userId || "GUEST",
                internalOrderId
            });

            const razorpayOrder = razorRes.data;

            if (!isRazorpayLoaded && !window.Razorpay) {
                throw new Error("Razorpay SDK not loaded. Please wait a moment and try again.");
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: razorpayOrder.amount,
                currency: "INR",
                name: "E-PDS",
                description: `Order Payment for ${selectedStore?.shopName || 'E-PDS'}`,
                order_id: razorpayOrder.id,
                handler: async function (response) {
                    setLoading(true);
                    try {
                        const verify = await authAxios.post("/api/verify-payment", response);
                        if (verify.data.success) {
                            dispatch(clearCart());
                            setCompletedOrder(currentOrderDetails);
                            setShowSuccessDialog(true);
                        } else {
                            setError(verify.data.message || "Payment verification failed.");
                        }
                    } catch (vErr) {
                        console.error("Verification error:", vErr);
                        setError("An error occurred during payment verification.");
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: address.fullName,
                    contact: address.phone,
                },
                theme: { color: "#0f172a" },
                modal: {
                    ondismiss: function() {
                        setLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error("Order process error:", err);
            const serverMsg = err.response?.data?.message;
            setError(serverMsg || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page-container">
            <Script 
                src="https://checkout.razorpay.com/v1/checkout.js"
                onLoad={() => setIsRazorpayLoaded(true)}
            />
            
            <div className="bg-decoration">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <div className="checkout-layout">
                <header className="checkout-header">
                    <button className="back-btn" onClick={handleBack}>
                        <ChevronLeft size={20} /> Back
                    </button>
                    <div className="title-group">
                        <h1>Secure Checkout</h1>
                        <p>Complete your purchase from {selectedStore?.shopName || 'Store'}</p>
                    </div>
                </header>

                <div className="checkout-grid">
                    <div className="checkout-main">
                        <form className="address-form-premium" onSubmit={handlePlaceOrder}>
                            <div className="section-title">
                                <MapPin size={24} className="title-icon" />
                                <h2>Delivery Information</h2>
                            </div>

                            {error && <div className="error-alert">{error}</div>}

                            <div className="form-grid">
                                <div className="input-field full">
                                    <div className="input-wrapper">
                                        <User className="field-icon" />
                                        <input type="text" name="fullName" value={address.fullName} onChange={handleChange} placeholder="Full Name" required />
                                    </div>
                                </div>

                                <div className="input-field full">
                                    <div className="input-wrapper">
                                        <Phone className="field-icon" />
                                        <input type="tel" name="phone" value={address.phone} onChange={handleChange} placeholder="Phone Number" required />
                                    </div>
                                </div>

                                <div className="input-field full">
                                    <div className="input-wrapper">
                                        <MapPin className="field-icon" />
                                        <input type="text" name="addressLine1" value={address.addressLine1} onChange={handleChange} placeholder="Address Line 1" required />
                                    </div>
                                </div>

                                <div className="input-field full">
                                    <div className="input-wrapper no-icon">
                                        <input type="text" name="addressLine2" value={address.addressLine2} onChange={handleChange} placeholder="Address Line 2 (Optional)" />
                                    </div>
                                </div>

                                <div className="input-field">
                                    <div className="input-wrapper no-icon">
                                        <input type="text" name="city" value={address.city} onChange={handleChange} placeholder="City" required />
                                    </div>
                                </div>

                                <div className="input-field">
                                    <div className="input-wrapper no-icon">
                                        <input type="text" name="pincode" value={address.pincode} onChange={handleChange} placeholder="Pincode" required />
                                    </div>
                                </div>
                            </div>

                            <div className="payment-method-section">
                                <div className="section-title">
                                    <CreditCard size={24} className="title-icon" />
                                    <h2>Payment Method</h2>
                                </div>
                                <div className="payment-options">
                                    <label className={`payment-option ${paymentMethod === 'online' ? 'active' : ''}`}>
                                        <input type="radio" name="paymentMethod" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
                                        <div className="option-content">
                                            <span className="option-title">Online Payment</span>
                                            <span className="option-desc">Pay securely via Razorpay</span>
                                        </div>
                                    </label>
                                    <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                                        <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                        <div className="option-content">
                                            <span className="option-title">Cash on Delivery</span>
                                            <span className="option-desc">Pay when you receive the order</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>

                    <aside className="checkout-sidebar">
                        <div className="summary-card">
                            <div className="section-title">
                                <CreditCard size={24} className="title-icon" />
                                <h2>Order Summary</h2>
                            </div>

                            <div className="items-list">
                                {cartItems.map(item => (
                                    <div key={item.id} className="summary-item">
                                        <span className="item-name">{item.name} <span className="item-qty">x{item.quantity}</span></span>
                                        <span className="item-total">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="price-breakdown">
                                <div className="price-row">
                                    <span>Cart Amount Total</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                                <div className="price-row">
                                    <span>Delivery Fee</span>
                                    <span className="free">FREE</span>
                                </div>
                                <div className="divider"></div>
                                <div className="price-row grand-total">
                                    <span>Total Amount</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                            </div>

                            <button type="button" className="place-order-btn-premium" disabled={loading} onClick={handlePlaceOrder}>
                                {loading ? 'Processing...' : (paymentMethod === 'online' ? 'Pay Now' : 'Confirm Order')}
                            </button>

                            <p className="security-note">
                                <svg size="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                <span>SSL Encrypted Transaction</span>
                            </p>
                        </div>
                    </aside>
                </div>
            </div>

            <Dialog
                open={showSuccessDialog}
                onClose={() => { }}
                maxWidth="sm"
                fullWidth
                PaperProps={{ style: { borderRadius: 24, padding: '16px' } }}
            >
                <DialogContent>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                        <CheckCircleOutlineIcon color="success" style={{ fontSize: 64 }} />
                        <Typography variant="h5" fontWeight="800" color="#0f172a">
                            Order Confirmed!
                        </Typography>
                        
                        <div className="completed-order-details" style={{ width: '100%', background: '#f8fafc', padding: '20px', borderRadius: '16px', marginTop: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Order ID:</span>
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>#{completedOrder?.orderId?.slice(-8).toUpperCase()}</span>
                            </div>
                            
                            <div style={{ marginBottom: '16px' }}>
                                <span style={{ color: '#64748b', fontSize: '0.9rem', display: 'block', marginBottom: '8px' }}>Items:</span>
                                {completedOrder?.items.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '4px' }}>
                                        <span>{item.name} x{item.quantity}</span>
                                        <span>₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                                <span style={{ fontWeight: 700, color: '#0f172a' }}>Total Amount:</span>
                                <span style={{ fontWeight: 800, color: '#0f172a' }}>₹{completedOrder?.totalAmount}</span>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Payment Method:</span>
                                <span style={{ fontWeight: 600, color: '#10b981' }}>{completedOrder?.paymentMethod}</span>
                            </div>
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center', padding: '0 24px 24px' }}>
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        style={{ borderRadius: 12, textTransform: 'none', background: '#0f172a', padding: '12px', fontWeight: 700 }}
                        onClick={() => {
                            setShowSuccessDialog(false);
                            router.push('/orders');
                        }}
                    >
                        Go to My Orders
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}