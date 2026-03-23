"use client";
import React, { useState } from "react";
import "./page.scss";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "@/redux/cartSlice";
import useAuthAxios from "@/hooks/useAuthAxios";
import { Dialog, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ChevronLeft = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6" /></svg>
);

export default function CheckoutPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const authAxios = useAuthAxios();

    const selectedStore = useSelector(state => state.shop.selectedStore);
    const cartItems = useSelector((state) => {
        const activeTab = state.cart.tabs.find((t) => t.id === state.cart.activeTabId);
        return activeTab ? activeTab.items : [];
    });

    const totalPrice = cartItems.reduce((sum, item) => sum + item.total, 0);

    const [address, setAddress] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleBack = () => {
        router.back();
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!selectedStore) {
            setError("No store selected. Please go back and select a store.");
            return;
        }

        if (cartItems.length === 0) {
            setError("Cart is empty.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const orderData = {
                storeId: selectedStore._id || selectedStore.id,
                items: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    unit: item.selectedUnit,
                    price: item.price,
                    total: item.total
                })),
                totalAmount: totalPrice,
                deliveryAddress: address,
                status: "pending"
            };

            const response = await authAxios.post('/api/orders', orderData);

            if (response && response.data && response.data.success) {
                dispatch(clearCart());
                setShowSuccessDialog(true);
            } else {
                setError("Failed to place order.");
            }
        } catch (err) {
            console.error("Order error", err);
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page-container">
            <div className="checkout-header">
                <button className="back-btn" onClick={handleBack}>
                    <ChevronLeft size={20} /> Back to Cart
                </button>
                <h1>Checkout</h1>
            </div>

            <div className="checkout-content">
                <form className="address-form" onSubmit={handlePlaceOrder}>
                    <h2>Delivery Address</h2>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label>Full Name *</label>
                        <input type="text" name="fullName" value={address.fullName} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Phone Number *</label>
                        <input type="tel" name="phone" value={address.phone} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Address Line 1 *</label>
                        <input type="text" name="addressLine1" value={address.addressLine1} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Address Line 2</label>
                        <input type="text" name="addressLine2" value={address.addressLine2} onChange={handleChange} />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>City *</label>
                            <input type="text" name="city" value={address.city} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>State *</label>
                            <input type="text" name="state" value={address.state} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group half">
                        <label>Pincode *</label>
                        <input type="text" name="pincode" value={address.pincode} onChange={handleChange} required />
                    </div>

                    <div className="order-summary-box">
                        <div className="order-summary-row total">
                            <span>Amount to Pay:</span>
                            <span>₹{totalPrice}</span>
                        </div>
                    </div>

                    <button type="submit" className="place-order-btn" disabled={loading}>
                        {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                </form>
            </div>

            <Dialog
                open={showSuccessDialog}
                onClose={() => { }}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    style: { borderRadius: 16, padding: '16px', textAlign: 'center' }
                }}
            >
                <DialogContent>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                        <CheckCircleOutlineIcon color="success" style={{ fontSize: 64 }} />
                        <Typography variant="h5" fontWeight="bold">
                            Order Placed!
                        </Typography>
                        <Typography color="textSecondary">
                            Your order has been placed successfully. Thank you for shopping with us!
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center', paddingBottom: '16px' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        style={{ borderRadius: 8, textTransform: 'none' }}
                        onClick={() => {
                            setShowSuccessDialog(false);
                            router.push('/orders');
                        }}
                    >
                        View My Orders
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
