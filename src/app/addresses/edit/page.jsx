"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import useAuthAxios from "@/hooks/useAuthAxios";
import { 
    Box, 
    Container, 
    Typography, 
    TextField, 
    Button, 
    Paper, 
    IconButton,
    Grid,
    CircularProgress,
    Alert
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function EditAddressContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const addressId = searchParams.get('id');
    const authAxios = useAuthAxios();
    const user = useSelector(state => state.auth.user);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "Kerala",
        pincode: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAddress = async () => {
            if (!addressId) return;
            try {
                const response = await authAxios.get(`/api/user/addresses/details?id=${addressId}`);
                if (response.data.success) {
                    setFormData(response.data.data);
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Could not load address details.");
            } finally {
                setLoading(false);
            }
        };

        fetchAddress();
    }, [addressId, authAxios]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const sanitized = value.replace(/[^0-9]/g, '').slice(0, 10);
            setFormData({ ...formData, [name]: sanitized });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            await authAxios.put(`/api/user/addresses?id=${addressId}`, formData);
            router.push("/addresses");
        } catch (err) {
            console.error("Update error:", err);
            setError("Failed to update address.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>;

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Box display="flex" alignItems="center" mb={4}>
                <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" fontWeight="800" color="#0f172a">
                    Edit Address
                </Typography>
            </Box>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address Line 1"
                                name="addressLine1"
                                value={formData.addressLine1}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address Line 2"
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Pincode"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={saving}
                                sx={{ mt: 2, py: 2, borderRadius: 3, background: '#0f172a' }}
                            >
                                {saving ? "Saving..." : "Update Address"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}

export default function EditAddressPage() {
    return (
        <Suspense fallback={<Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>}>
            <EditAddressContent />
        </Suspense>
    );
}
