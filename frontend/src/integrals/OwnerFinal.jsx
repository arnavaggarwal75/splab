import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

import axiosClient from "../api/axiosClient";
import { useUser } from "../contexts/UserContext";
import logo from "../assets/logo.png";
import { sumMoney } from "../utils/formatMoney";
import MemberSplit from "../components/MemberSplit";
import SummaryList from "../components/SummaryList";

function OwnerFinal() {
  const [searchParams] = useSearchParams();
  const tabId = searchParams.get("code");
  const navigate = useNavigate();

  const { user, removeUser } = useUser();

  const [members, setMembers] = useState([]);
  const [billSummary, setBillSummary] = useState({});

  useEffect(() => {
    if(!user) return;

    axiosClient.get(`/tabs/${tabId}/owner_summary`).then((response) => {
      setBillSummary(response.data.bill_summary)
      setMembers(response.data.members)
    }).catch((error) => {
      console.error("Error fetching initial members:", error);
    });

    const membersRef = collection(db, "Tabs", tabId, "members");
    const unsubscribe = onSnapshot(membersRef, (snapshot) => {
      const newMembers = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setMembers(newMembers);
    });

    return () => unsubscribe();
  }, [user]);


  const handleSettleTab = () => {
    axiosClient.delete(`/tabs/${tabId}`).then(() => {
      removeUser();
      navigate("/");
    }).catch((err) => {
      console.error("Error settling tab:", err);
      alert("Something went wrong while settling the tab.");
    });
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-200 px-8 text-center font-mono">
      <div className="bg-white p-8 py-6 flex flex-col items-center justify-center rounded-2xl w-[80%] shadow-lg">
        <img
          src={logo}
          className="w-24 h-24 mb-4 flex items-center justify-center"
          alt="logo"
        />

        <h1 className="text-2xl font-bold mb-4">Split Summary</h1>
        <div className="w-full flex flex-col gap-2 mb-2 max-h-64">
          <p className="text-gray-500 text-sm font-bold">
            Member Summary
          </p>
          <div className="border-t border-gray-300">
            {members.map((member) => (
              member.id !== user.memberId ? (
                <MemberSplit
                  key={member.id}
                  name={member.name || "Unknown"}
                  share={sumMoney([member.share, member.tax, member.tip])}
                  submitted={!!member.paid}
                />
              ) : null
            ))}
          </div>
        </div>
        <div className="w-full">
          <p className="text-gray-500 text-sm font-bold mb-2">
            Bill Summary
          </p>
          <SummaryList total borderTop fullWidth summary={[
            { name: "Subtotal", amount: billSummary.subtotal },
            { name: "Tax", amount: billSummary.tax },
            { name: "Total Tip", amount: billSummary.total_tip },
          ]} />
        </div>
        <button
          onClick={handleSettleTab}
          className="mt-6 px-6 py-2 rounded-full text-white font-semibold shadow-md bg-[var(--primary)] btn-pressable">
          Settle Splab
        </button>
      </div>
    </div>
  );
}

export default OwnerFinal;
