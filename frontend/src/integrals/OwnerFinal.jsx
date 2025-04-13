import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";  // Your custom Axios instance
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust import path if needed
import MemberSplit from "../components/MemberSplit";
import logo from "../assets/logo.png";

function OwnerFinal() {
  // Store all members returned from the backend (and updated in real time)
  const [members, setMembers] = useState([]);

  // 1) Hardcode the Tab ID for now
  const tabId = "mid771";

  useEffect(() => {
    // 2) Call your FastAPI endpoint once on mount to load initial data
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
            <MemberSplit
              key={member.id}   // or idx if no 'id' from your endpoint
              name={member.name || "Unknown"}
              // Show the 'share' field if it exists, otherwise 0
              share={member.share || 0}
              // Pass the 'submitted' field to show the indicator
              submitted={!!member.submitted}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default OwnerFinal;
