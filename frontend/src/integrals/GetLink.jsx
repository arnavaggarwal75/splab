import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import logo from "../assets/logo.png";

const GetLink = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [shareLink, setShareLink] = useState("localhost:5173/member-home?code=PLACEHOLDER")

  useEffect(() => {
    const code = searchParams.get("code")
    if(!code) {
      navigate("/")
    }
    setShareLink((prev) => prev.replace("PLACEHOLDER", code))
  }, [searchParams])

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-200 px-8 text-center font-mono">
      <div className="bg-white p-8 py-6 flex flex-col items-center justify-center rounded-2xl w-[80%] shadow-lg">
        <img
          src={logo}
          className="w-24 h-24 mb-4 flex items-center justify-center"
        />

        <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
        <p className="text-gray-500 text-sm mb-6">
          Share this link with your tab members
        </p>

        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-3 w-full max-w-xs mb-6">
          <span className="text-xs text-gray-700 truncate">{shareLink}</span>
          <button
            onClick={handleCopy}
            className="ml-2 px-3 py-1 bg-[var(--primary)] text-white rounded-full text-xs shadow hover:opacity-90 active:opacity-75 active:scale-95 transition duration-150 ease-in-out"
          >
            Copy
          </button>
        </div>

        <button
          onClick={() => navigate(`/tab-list/?code=${searchParams.get("code")}`)}
          className="px-6 py-3 bg-[var(--primary)] text-white rounded-full shadow-md hover:opacity-90 text-sm font-semibold active:opacity-75 active:scale-95 transition duration-150 ease-in-out"
        >
          Go to Tab
        </button>
      </div>
    </div>
  );
};

export default GetLink;
