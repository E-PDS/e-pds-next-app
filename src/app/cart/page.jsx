"use client";
import React from "react";
import "./page.scss";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, updateItemQuantity, clearCart } from "@/redux/cartSlice";

const ChevronLeft = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6" /></svg>
);

const Trash2 = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
);

export default function CartPage() {
    const router = useRouter();
    const dispatch = useDispatch();

    const cartItems = useSelector((state) => {
        const activeTab = state.cart.tabs.find((t) => t.id === state.cart.activeTabId);
        return activeTab ? activeTab.items : [];
    });

    const handleBack = () => {
        router.back();
    };

    const handleUpdateQuantity = (item, delta) => {
        const newQty = item.quantity + delta;
        if (newQty <= 0) {
            dispatch(removeItem(item.id));
        } else {
            dispatch(updateItemQuantity({
                id: item.id,
                quantity: newQty,
                total: item.price * newQty
            }));
        }
    };

    const handleRemove = (id) => {
        dispatch(removeItem(id));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.total, 0);

    return (
        <div className="cart-page-container">
            <div className="cart-page-header">
                <button className="back-btn" onClick={handleBack}>
                    <ChevronLeft size={20} /> Back
                </button>
                <div className="header-info">
                    <h1>Your Cart</h1>
                    <p className="subtitle">Review your items before checkout</p>
                </div>
                {cartItems.length > 0 && (
                    <button className="clear-cart-btn" onClick={handleClearCart}>
                        <Trash2 size={16} /> Clear Cart
                    </button>
                )}
            </div>

            <div className="cart-content">
                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <h2>Your cart is empty</h2>
                        <button onClick={() => router.push('/products')} className="continue-shopping">
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="cart-items">
                            {cartItems.map(item => (
                                <div key={item.id} className="cart-item">
                                    <div className="item-details">
                                        <h3>{item.name}</h3>
                                        <p className="price">₹{item.price} / {item.selectedUnit}</p>
                                    </div>
                                    <div className="item-actions">
                                        <div className="quantity-controls">
                                            <button onClick={() => handleUpdateQuantity(item, -1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => handleUpdateQuantity(item, 1)}>+</button>
                                        </div>
                                        <div className="item-total">
                                            ₹{item.total}
                                        </div>
                                        <button className="remove-item" onClick={() => handleRemove(item.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <div className="summary-row">
                                <span>Total Items</span>
                                <span>{totalItems}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total Amount</span>
                                <span>₹{totalPrice}</span>
                            </div>
                            <button className="checkout-btn" onClick={() => router.push('/checkout')}>
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
