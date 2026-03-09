"use client";
import React, { useState } from "react";
import "./page.scss";

const Store = ({ size=24, className="" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
);

const ShoppingBasket = ({ size=24, className="" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/></svg>
);

const MapPin = ({ size=24, className="" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
);

const ChevronLeft = ({ size=24, className="" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6"/></svg>
);

const ArrowRight = ({ size=24, className="" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

const RATION_STORES = [
  { id: 1, name: "ARD 105, Downtown", address: "Opposite City Hall, Main Road", status: "Open" },
  { id: 2, name: "ARD 112, East Avenue", address: "Near Railway Station", status: "Open" },
  { id: 3, name: "ARD 204, West Side", address: "Complex Building", status: "Closed" },
  { id: 4, name: "ARD 301, North Hills", address: "Valley View Center", status: "Open" },
];

const SUPPLYCO_STORES = [
  { id: 1, name: "Maveli Store, North Hills", address: "Near Police Station", status: "Open" },
  { id: 2, name: "Supplyco Supermarket", address: "City Center Mall", status: "Open" },
  { id: 3, name: "Supplyco Medical Store", address: "First Floor, Metro Station", status: "Closed" },
];

export default function SelectStore() {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const renderStoreList = (stores) => {
        return (
            <div className="store-list">
                {stores.map(store => (
                    <div key={store.id} className={`store-card ${store.status.toLowerCase()}`}>
                        <div className="store-info">
                            <div className="store-header">
                                <Store className="store-icon-small" size={20} />
                                <h3>{store.name}</h3>
                            </div>
                            <div className="store-address">
                                <MapPin className="address-icon" size={16} />
                                <p>{store.address}</p>
                            </div>
                        </div>
                        <div className="store-action">
                            <span className="status-badge">{store.status}</span>
                            <button className="select-btn" disabled={store.status === 'Closed'}>
                                Select <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="select-store-page-container">
            <div className="select-store-page-header">
                {selectedCategory && (
                    <button className="back-btn" onClick={() => setSelectedCategory(null)}>
                        <ChevronLeft size={20} /> Back
                    </button>
                )}
                <h1>{selectedCategory === 'ration' ? 'Select Ration Store' : selectedCategory === 'supplyco' ? 'Select Supplyco Outlet' : 'Choose Store Type'}</h1>
                <p className="subtitle">
                    {selectedCategory ? 'Find and select an open store near you to continue' : 'Please select the type of store you want to purchase from'}
                </p>
            </div>

            <div className="select-store-content">
                {!selectedCategory ? (
                    <div className="category-selection">
                        <div className="category-card ration-card" onClick={() => setSelectedCategory('ration')}>
                            <div className="icon-wrapper">
                                <Store size={48} className="category-icon" />
                            </div>
                            <h2>Ration Store</h2>
                            <p>Public Distribution System Outlets</p>
                            <div className="card-footer">
                                <span>Browse Stores</span>
                                <ArrowRight size={20} />
                            </div>
                        </div>

                        <div className="category-card supplyco-card" onClick={() => setSelectedCategory('supplyco')}>
                            <div className="icon-wrapper">
                                <ShoppingBasket size={48} className="category-icon" />
                            </div>
                            <h2>Supplyco</h2>
                            <p>Maveli Stores & Supermarkets</p>
                            <div className="card-footer">
                                <span>Browse Stores</span>
                                <ArrowRight size={20} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="stores-container">
                        {selectedCategory === 'ration' ? renderStoreList(RATION_STORES) : renderStoreList(SUPPLYCO_STORES)}
                    </div>
                )}
            </div>
        </div>
    );
}
