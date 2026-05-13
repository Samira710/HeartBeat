"use client";

import { useState } from "react";
import {
  CreditCard,
  ShieldCheck,
  HeartPulse,
  CalendarCheck,
} from "lucide-react";

const PaymentCard = ({
  appointmentId,
  userId,
}: {
  appointmentId?: string;
  userId?: string;
}) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      if (!appointmentId || !userId) {
        alert("Missing payment information.");
        return;
      }

      setLoading(true);

      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId,
          userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Payment failed.");
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url; // ✅ Stripe redirect
      } else {
        alert("No payment URL returned.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg rounded-3xl border border-gray-800 bg-[#151821] p-8 shadow-2xl">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="rounded-2xl bg-red-500/10 p-4">
          <HeartPulse className="h-8 w-8 text-red-500" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white">HeartBeat Payment</h1>
          <p className="mt-1 text-sm text-gray-400">
            Securely complete your appointment payment
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 rounded-2xl border border-gray-800 bg-[#1b1f2a] p-5">
        <div className="mb-4 flex items-center gap-3">
          <CalendarCheck className="h-5 w-5 text-blue-400" />
          <p className="font-semibold text-white">Appointment Summary</p>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Service</span>
            <span className="font-medium text-white">Doctor Appointment</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Status</span>
            <span className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-medium text-yellow-400">
              Pending
            </span>
          </div>

          <div className="border-t border-gray-800 pt-4">
            <div className="flex justify-between">
              <span className="text-base font-semibold text-white">Total</span>
              <span className="text-2xl font-bold text-red-500">$25.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-600 px-6 py-4 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <CreditCard className="h-5 w-5" />
        {loading ? "Redirecting..." : "Pay Securely"}
      </button>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
        <ShieldCheck className="h-4 w-4 text-green-500" />
        <span>Encrypted & secure payment via Stripe</span>
      </div>
    </div>
  );
};

export default PaymentCard;
