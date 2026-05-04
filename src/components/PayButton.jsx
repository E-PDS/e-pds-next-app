"use client";
import { useEffect } from "react";

export default function PayButton({ cart }) {

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const payNow = async () => {

        // ✅ calculate cart total INSIDE function
        const cartTotal = cart.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);

        const res = await fetch("/api/create-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: cartTotal,
                userId: "USER1",
            }),
        });

        const order = await res.json();

        const rzp = new window.Razorpay({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: "INR",
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
                    alert("Payment Success");
                } else {
                    alert("Payment Failed");
                }
            },
        });

        rzp.open();
    };

    return (
        <button onClick={payNow}>
            Pay Now
        </button>
    );
}