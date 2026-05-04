"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import HomeIcon from "@mui/icons-material/Home";

export default function NewAddressPage() {
    const router = useRouter();
    const authAxios = useAuthAxios();
    const user = useSelector(state => state.auth.user);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "Kerala",
        pincode: "",
        isDefault: false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

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
        setLoading(true);
        setError("");

        try {
            const response = await authAxios.post("/api/user/addresses", {
                ...formData,
                userId: user?.userId
            });

            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => router.push("/addresses"), 1500);
            } else {
                setError(response.data.message || "Failed to add address");
            }
        } catch (err) {
            console.error("Add address error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Box display="flex" alignItems="center" mb={4}>
                <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" fontWeight="800" color="#0f172a">
                    New Address
                </Typography>
            </Box>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>Address added successfully!</Alert>}

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
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                inputProps={{ maxLength: 10 }}
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
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address Line 2 (Optional)"
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleChange}
                                variant="outlined"
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
                                variant="outlined"
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
                                variant="outlined"
                                inputProps={{ maxLength: 6 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{ 
                                    mt: 2, 
                                    py: 2, 
                                    borderRadius: 3, 
                                    background: '#0f172a',
                                    fontWeight: 700,
                                    '&:hover': { background: '#334155' }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Save Address"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}
