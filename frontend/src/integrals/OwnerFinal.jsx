import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";  
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase"; 
import MemberSplit from "../components/MemberSplit";
import logo from "../assets/logo.png";
import { useSearchParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

function OwnerFinal() {
  const [members, setMembers] = useState([]);

  const [searchParams] = useSearchParams();
  const tabId = searchParams.get("code");

  const { user, setUser } = useUser();
  const navigate = useNavigate();


  useEffect(() => {
    // 2) Call your FastAPI endpoint once on mount to load initial data
    const memberId = localStorage.getItem('memberId');
    setUser(prev => ({...prev, memberId}))
    axiosClient
      .get(`/tabs/${tabId}/members`)
      .then((response) => {
        // e.g. { "members": [ { "id": "..", "name": "Rishhhh", "submitted": false }, ... ] }
        setMembers(response.data.members);
      })
      .catch((error) => {
        console.error("Error fetching initial members:", error);
      });

    // 3) Set up a single Firestore listener on the members subcollection
    //    so changes to 'submitted' (or any field) appear in real time
    const membersRef = collection(db, "Tabs", tabId, "members");
    const unsubscribe = onSnapshot(membersRef, (snapshot) => {
      // Convert snapshot docs into a JS array
      const newMembers = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      // Overwrite local state with the latest data from Firestore
      setMembers(newMembers);
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);


  const handleSettleTab = () => {
    axiosClient
      .delete(`/tabs/${tabId}`)
      .then(() => {
        alert("Tab has been settled and deleted.");
        navigate("/");
      })
      .catch((err) => {
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
        <p className="text-gray-500 text-sm mb-6">
          Here’s how much each member owes you
        </p>

        <div className="w-full flex flex-col gap-2 border-t border-gray-300 overflow-y-scroll max-h-64">
          {members.map((member) => (
            member.id !== user.memberId ? (
              <MemberSplit
                key={member.id}
                name={member.name || "Unknown"}
                share={(Math.round(member.share * 100) / 100).toFixed(2) || 0}
                submitted={!!member.paid}
              />
            ) : null
          ))}
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
