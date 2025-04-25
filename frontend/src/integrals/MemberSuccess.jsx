import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import confetti from "canvas-confetti";
import logo from "../assets/logo.png";

const MemberSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabId = searchParams.get("code");
  const memberId = searchParams.get("memberId");

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.7 },
    });
    if (tabId && memberId) {
      axiosClient
        .post(`/tabs/mark_paid/${tabId}/${memberId}`)
        .then(() => console.log("✅ Marked paid"))
        .catch((err) => console.error("❌ Error marking paid", err));
    }
  }, [tabId, memberId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-200 px-8 text-center font-mono">
      <div className="bg-white p-8 py-6 flex flex-col items-center justify-center rounded-2xl w-[80%] shadow-lg">
        <img src={logo} className="w-24 h-24 mb-4" alt="Logo" />

        <h2 className="text-2xl font-bold mb-2 text-[var(--primary)]">You’re all paid up!</h2>
        <p className="text-gray-500 text-sm mb-6">Thanks for settling your share.</p>
        <button onClick={() => navigate("/")} className="bg-[var(--primary)] text-white font-semibold btn-pressable rounded-full px-6 py-2">Go to Home</button>
      </div>
    </div>
  );
};

export default MemberSuccess;
