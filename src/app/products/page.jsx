"use client";
import React, { useState, useEffect } from "react";
import "./page.scss";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { addItem, removeItem, updateItemQuantity } from "@/redux/cartSlice";
import useAuthAxios from "@/hooks/useAuthAxios";

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
    const dispatch = useDispatch();
    const authAxios = useAuthAxios();
    const selectedStore = useSelector(state => state.shop.selectedStore);
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!selectedStore) {
            router.push('/select-store');
            return;
        }

        const fetchProducts = async () => {
            try {
                const res = await authAxios.get(`/api/products/${selectedStore._id || selectedStore.id}`);
                if (res?.data?.success) {
                    setProducts(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedStore]);

    // Read cart items from Redux
    const cartItems = useSelector((state) => {
        const activeTab = state.cart.tabs.find((t) => t.id === state.cart.activeTabId);
        return activeTab ? activeTab.items : [];
    });

    const handleBack = () => {
        router.push('/select-store');
    };

    const updateQuantity = (product, delta) => {
        const itemInCart = cartItems.find((item) => item.id === product.id);
        const currentQty = itemInCart ? itemInCart.quantity : 0;
        const newQty = Math.max(0, currentQty + delta);
        
        // Stock limit logic (cannot add more than stock)
        if (delta > 0 && newQty > product.stock) {
            alert(`Cannot add more than available stock (${product.stock}).`);
            return;
        }

        if (newQty === 0 && itemInCart) {
            dispatch(removeItem(product.id));
        } else if (!itemInCart && newQty > 0) {
            dispatch(addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: newQty,
                total: product.price * newQty,
                selectedUnit: product.unit,
                icon: product.icon
            }));
        } else if (itemInCart) {
            dispatch(updateItemQuantity({
                id: product.id,
                quantity: newQty,
                total: product.price * newQty
            }));
        }
    };

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.total, 0);

    return (
        <div className="products-page-container">
            <div className="products-page-header">
                <button className="back-btn" onClick={handleBack}>
                    <ChevronLeft size={20} /> Back
                </button>
                <div className="header-info">
                    <h1>Available Products at {selectedStore?.shopName || 'Store'}</h1>
                    <p className="subtitle">Select the items you need and choose your desired quantity</p>
                </div>
            </div>

            <div className="products-grid">
                {loading ? (
                    <div className="loading-state">Loading products...</div>
                ) : products.length === 0 ? (
                    <div className="empty-state">No products found for this store.</div>
                ) : products.map((product) => {
                    const itemInCart = cartItems.find(item => item.id === product.id);
                    const quantity = itemInCart ? itemInCart.quantity : 0;
                    const isOutOfStock = product.stock === 0 || !product.inStock;
                    
                    return (
                        <div key={product.id} className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
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
                                {isOutOfStock && <span className="out-of-stock-label" style={{ color: 'red', fontSize: '12px', fontWeight: 'bold' }}>Out of Stock</span>}
                            </div>
                            
                            <div className="product-actions">
                                {isOutOfStock ? (
                                    <button className="add-to-cart-btn disabled" disabled style={{ backgroundColor: '#ccc', cursor: 'not-allowed' }}>
                                        Out of Stock
                                    </button>
                                ) : quantity === 0 ? (
                                    <button 
                                        className="add-to-cart-btn" 
                                        onClick={() => updateQuantity(product, 1)}
                                    >
                                        Add to Cart
                                    </button>
                                ) : (
                                    <div className="quantity-controls">
                                        <button 
                                            className="qty-btn" 
                                            onClick={() => updateQuantity(product, -1)}
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
                                            onClick={() => updateQuantity(product, 1)}
                                            aria-label="Increase quantity"
                                            disabled={quantity >= product.stock}
                                            style={{ opacity: quantity >= product.stock ? 0.5 : 1 }}
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
        </div>
    );
}