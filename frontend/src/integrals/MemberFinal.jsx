import React from "react";
import logo from "../assets/logo.png";
import { useUser } from "../contexts/UserContext";
import { useLocation } from "react-router-dom";

const MemberFinal = () => {
  const [amount, setAmount] = React.useState(location.state.amount);
  const [zelleId, setZelleId] = React.useState(location.state.zelleId);
  const location = useLocation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-200 px-8 text-center font-mono">
      <div className="bg-white p-8 py-6 flex flex-col items-center justify-center rounded-2xl w-[80%] shadow-lg">
        <img
          src={logo}
          className="w-24 h-24 mb-4 flex items-center justify-center"
        />

        <p className="text-lg mb-2">Please transfer your share to</p>
        <div className="mt-2 bg-gray-100 shadow-inner p-2 rounded-2xl text-gray-800 text-md w-full max-w-xs">
          {zelleId}
        </div>

        <p className="text-lg mt-8">You owe:</p>
        <p className="text-4xl font-bold mt-2">
          ${amount.toFixed(2)}
        </p>

        <button
          onClick={() => alert("Thank you!")}
          className="mt-8 px-6 py-3 bg-[var(--primary)] text-white rounded-full shadow-md hover:opacity-90 transition text-sm font-semibold"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default MemberFinal;
