import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useSocket } from "../contexts/SocketContext";

const MemberHome = () => {
  const [tabOwner, setTabOwner] = useState("John");
  const navigate = useNavigate();
  const { setUser, user } = useUser();
  const [name, setName] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [code, setCode] = useState("");
  const { socket } = useSocket();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      return;
    }

    setUser({
      name,
      isOwner: false,
    });

    socket.emit("join_tab", {
      tab_id: code,
      isOwner: false,
      user_id: user.id,
      user_name: name,
    });

    navigate("/tab-list?code=" + code);
  };

  useEffect(() => {
    if (!searchParams.get("code")) {
      navigate("/");
    }
    setCode(searchParams.get("code"));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-200">
      <div className="bg-white p-15 py-5 flex flex-col items-center justify-center rounded-2xl w-[80%] shadow-lg">
        <img
          src={logo}
          className="w-32 h-32 mb-6 flex items-center justify-center"
        />

        <h1 className="text-2xl font-bold mb-2">Join {tabOwner}'s Tab</h1>
        <p className="text-gray-500 text-sm mb-8">Enter your name to join</p>

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

          <button
            type="submit"
            className="text-black font-semibold rounded-full py-3 mt-4 shadow-md bg-[var(--secondary)]"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
};

export default MemberHome;
