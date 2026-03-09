"use client";
import React, { useState } from "react";
import "./page.scss";
import { useRouter } from "next/navigation";

// Icons 
const ChevronLeft = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6" /></svg>
);

const ViewCart = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
);

const Plus = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

const Minus = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/></svg>
);

// Dummy products with associated icons
const DUMMY_PRODUCTS = [
  { id: 1, name: "Premium White Rice", description: "High quality sorted white rice", price: 15, unit: "kg", inStock: true, icon: "wheat" },
  { id: 2, name: "Whole Wheat", description: "Locally sourced whole wheat grains", price: 20, unit: "kg", inStock: true, icon: "wheat" },
  { id: 3, name: "Refined Sugar", description: "Pure white crystallized sugar", price: 40, unit: "kg", inStock: true, icon: "package" },
  { id: 4, name: "Kerosene", description: "Cooking and lighting grade", price: 25, unit: "L", inStock: true, icon: "flame" },
  { id: 5, name: "Lentils (Toor Dal)", description: "Protein-rich pulses", price: 65, unit: "kg", inStock: true, icon: "package" },
  { id: 6, name: "Cooking Oil", description: "Refined sunflower oil", price: 110, unit: "L", inStock: true, icon: "droplet" },
];

const getIconForProduct = (iconType, size = 48) => {
    switch (iconType) {
        case "wheat":
            return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22 22 2"/><path d="M11.5 12.5C7 17 2 22 2 22"/><path d="M11 6c-3-3-5.5-3-7.5-1.5C1.5 6.5 1.5 9 4.5 12"/><path d="M16 11c-3-3-5.5-3-7.5-1.5C6.5 11.5 6.5 14 9.5 17"/><path d="M18 16c-2.5-2.5-5-2.5-7-1-2 1.5-2 4.5 1 7.5"/></svg>;
        case "package":
            return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>;
        case "flame":
            return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;
        case "droplet":
            return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>;
        default:
            return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>;
    }
};

export default function Products() {
    const router = useRouter();
    const [cart, setCart] = useState({});

    const handleBack = () => {
        router.push('/select-store');
    };

    const updateQuantity = (productId, delta) => {
        setCart((prev) => {
            const currentQty = prev[productId] || 0;
            const newQty = Math.max(0, currentQty + delta);
            
            const newCart = { ...prev };
            if (newQty === 0) {
                delete newCart[productId];
            } else {
                newCart[productId] = newQty;
            }
            return newCart;
        });
    };

    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
        const product = DUMMY_PRODUCTS.find(p => p.id === parseInt(id));
        return sum + (product ? product.price * qty : 0);
    }, 0);

    return (
        <div className="products-page-container">
            <div className="products-page-header">
                <button className="back-btn" onClick={handleBack}>
                    <ChevronLeft size={20} /> Back
                </button>
                <div className="header-info">
                    <h1>Available Products</h1>
                    <p className="subtitle">Select the items you need and choose your desired quantity</p>
                </div>
                {totalItems > 0 && (
                    <div className="cart-summary">
                        <div className="cart-icon-wrapper">
                            <ViewCart size={24} className="cart-icon" />
                            <span className="cart-badge">{totalItems}</span>
                        </div>
                        <div className="cart-total">
                            <span className="cart-label">Total</span>
                            <span className="cart-amount">₹{totalPrice}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="products-grid">
                {DUMMY_PRODUCTS.map((product) => {
                    const quantity = cart[product.id] || 0;
                    
                    return (
                        <div key={product.id} className="product-card">
                            <div className="product-icon-container">
                                {getIconForProduct(product.icon, 48)}
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-desc">{product.description}</p>
                                <div className="product-price-row">
                                    <span className="price">₹{product.price}</span>
                                    <span className="unit">/ {product.unit}</span>
                                </div>
                            </div>
                            
                            <div className="product-actions">
                                {quantity === 0 ? (
                                    <button 
                                        className="add-to-cart-btn" 
                                        onClick={() => updateQuantity(product.id, 1)}
                                    >
                                        Add to Cart
                                    </button>
                                ) : (
                                    <div className="quantity-controls">
                                        <button 
                                            className="qty-btn" 
                                            onClick={() => updateQuantity(product.id, -1)}
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <div className="qty-display">
                                            <span className="qty-value">{quantity}</span>
                                            <span className="qty-unit">{product.unit}</span>
                                        </div>
                                        <button 
                                            className="qty-btn" 
                                            onClick={() => updateQuantity(product.id, 1)}
                                            aria-label="Increase quantity"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {totalItems > 0 && (
                <div className="floating-checkout-bar">
                    <div className="checkout-info">
                        <span className="items-count">{totalItems} Item{totalItems !== 1 && 's'}</span>
                        <span className="total-divider">•</span>
                        <span className="total-amount">₹{totalPrice}</span>
                    </div>
                    <button className="checkout-btn">
                        Proceed to Checkout
                    </button>
                </div>
            )}
        </div>
    );
}