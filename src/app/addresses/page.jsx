"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import useAuthAxios from "@/hooks/useAuthAxios";
import { 
    Box, 
    Container, 
    Typography, 
    Button, 
    Paper, 
    IconButton,
    Grid,
    CircularProgress,
    Card,
    CardContent,
    Fab
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function AddressesPage() {
    const router = useRouter();
    const authAxios = useAuthAxios();
    const user = useSelector(state => state.auth.user);

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await authAxios.get(`/api/user/addresses?userId=${user?.userId}`);
                if (response.data.success) {
                    setAddresses(response.data.data);
                }
            } catch (err) {
                console.error("Fetch addresses error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.userId) {
            fetchAddresses();
        }
    }, [user?.userId, authAxios]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        try {
            await authAxios.delete(`/api/user/addresses?id=${id}`);
            setAddresses(addresses.filter(a => a._id !== id));
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress color="inherit" />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box display="flex" alignItems="center">
                    <IconButton onClick={() => router.push('/options')} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" fontWeight="800" color="#0f172a">
                        Your Addresses
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/addresses/new')}
                    sx={{ 
                        borderRadius: 3, 
                        background: '#0f172a',
                        px: 3,
                        '&:hover': { background: '#334155' }
                    }}
                >
                    Add New
                </Button>
            </Box>

            {addresses.length === 0 ? (
                <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4, border: '1px dashed #cbd5e1' }} elevation={0}>
                    <LocationOnIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                    <Typography variant="h6" color="#64748b">No saved addresses found</Typography>
                    <Button 
                        sx={{ mt: 2 }} 
                        onClick={() => router.push('/addresses/new')}
                    >
                        Add your first address
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {addresses.map((addr) => (
                        <Grid item xs={12} key={addr._id}>
                            <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0' }} elevation={0}>
                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight="700">{addr.fullName}</Typography>
                                        <Typography color="#64748b">{addr.addressLine1}</Typography>
                                        <Typography color="#64748b">{addr.addressLine2}</Typography>
                                        <Typography color="#64748b">{addr.city}, {addr.pincode}</Typography>
                                        <Typography color="#64748b" variant="body2" sx={{ mt: 1 }}>{addr.phone}</Typography>
                                    </Box>
                                    <IconButton onClick={() => handleDelete(addr._id)} color="error">
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}
