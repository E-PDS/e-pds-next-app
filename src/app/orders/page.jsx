"use client";
import React, { useState, useEffect } from "react";
import useAuthAxios from "@/hooks/useAuthAxios";
import "./page.scss";
import { CircularProgress, Box, Typography, Card, CardContent, Chip, Divider, Grid } from "@mui/material";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

export default function OrdersPage() {
    const authAxios = useAuthAxios();
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

        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'warning';
            case 'completed': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <div className="orders-page-container">
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                My Orders
            </Typography>

            {orders.length === 0 ? (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8} opacity={0.6}>
                    <ShoppingBagIcon sx={{ fontSize: 80, mb: 2 }} color="disabled" />
                    <Typography variant="h6">No orders found</Typography>
                </Box>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <Card key={order._id} className="order-card" variant="outlined">
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Order #{order._id?.substring(order._id.length - 8).toUpperCase()}
                                    </Typography>
                                    <Chip
                                        label={order.status?.toUpperCase() || 'UNKNOWN'}
                                        color={getStatusColor(order.status)}
                                        size="small"
                                        className="status-chip"
                                    />
                                </Box>
                                <Divider sx={{ mb: 2 }} />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={8}>
                                        <Typography variant="body1" fontWeight="bold">
                                            {order.items?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Ordered on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                            Total Amount: <span style={{ fontWeight: 'bold', color: '#000' }}>₹{order.totalAmount}</span>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4} display="flex" justifyContent="flex-end" alignItems="flex-end">
                                        <Box display="flex" alignItems="center" gap={1} color="text.secondary">
                                            <LocalShippingIcon fontSize="small" />
                                            <Typography variant="caption">
                                                {order.deliveryAddress?.city || 'Delivery'}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
