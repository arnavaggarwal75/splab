import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import logo from "../assets/logo.png";

function Home() {
  const [isOwner, setIsOwner] = useState(true);
  const [name, setName] = useState("");
  const [zelleId, setZelleId] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isOwner) {
      if (!name || !zelleId) {
        alert("Please fill all fields");
        return;
      }
      setUser({
        name,
        zelleId,
        isOwner: true,
      });
      navigate("/upload");
    } else {
      if (!name || !code) {
        alert("Please fill all fields");
        return;
      }
      setUser({
        name,
        isOwner: false,
      });
      navigate(`/tab-list?code=${code}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-200">
      <div className="bg-white p-15 py-5 flex flex-col items-center justify-center rounded-2xl w-[80%] shadow-lg">
        <img
          src={logo}
          className=" w-32 h-32 mb-6 flex items-center justify-center "
        />

        <h1 className="text-2xl font-bold mb-2">
          {isOwner ? "Create a Splab!" : "Join a Splab!"}
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          {isOwner
            ? "Split your bill effortlessly"
            : "Enter the tab code to join"}
        </p>

        <form
          className="flex flex-col gap-4 w-full max-w-xs"
          onSubmit={handleSubmit}
        >
          <input
            className="bg-gray-100 rounded-xl p-3 text-sm border border-gray-300 focus:outline-none"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {isOwner ? (
            <input
              className="bg-gray-100 rounded-xl p-3 text-sm border border-gray-300 focus:outline-none"
              type="text"
              placeholder="Zelle ID"
              value={zelleId}
              onChange={(e) => setZelleId(e.target.value)}
            />
          ) : (
            <input
              className="bg-gray-100 rounded-xl p-3 text-sm border border-gray-300 focus:outline-none"
              type="text"
              placeholder="Tab Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          )}

          <button
            type="submit"
            className=" text-black font-semibold rounded-full py-3 mt-4 shadow-md bg-[var(--secondary)]"
          >
            {isOwner ? "Create Splab" : "Join Splab"}
          </button>
        </form>

        <button
          className="text-sm font-bold mt-6"
          onClick={() => setIsOwner(!isOwner)}
        >
          {isOwner ? "Join a Splab instead?" : "Create a Splab instead?"}
        </button>
      </div>
    </div>
  );
}

export default Home;
