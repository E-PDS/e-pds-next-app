"use client";

import { useEffect } from "react";

export default function PaymentPage() {

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handlePayment = async () => {
        const res = await fetch("/api/create-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: 100, userId: "USER1" }),
        });

        const order = await res.json();

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: "INR",
            name: "E - PUBLIC DISTRIBUTION SYSTEMS",
            order_id: order.id,

            handler: async function (response) {
                const verify = await fetch("/api/verify-payment", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(response),
                });

                const data = await verify.json();

                if (data.success) {
                    alert("Payment Successful");
                } else {
                    alert("Payment Failed");
                }
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Payment Page</h1>
            <button onClick={handlePayment}>Pay Now</button>
        </div>
    );
}