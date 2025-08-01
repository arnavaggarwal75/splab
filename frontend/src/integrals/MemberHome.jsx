import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import logo from "../assets/logo.png";
import axiosClient from "../api/axiosClient";
import { useUser } from "../contexts/UserContext";

const MemberHome = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const { user, saveUser, removeUser } = useUser();

  const [tabOwner, setTabOwner] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      alert("Please enter your name");
      return;
    }
    removeUser();
    saveUser({
      ...user,
      name,
      isOwner: false,
    });
    navigate("/tab-list?code=" + code);
  };

  useEffect(() => {
    if (!code) {
      navigate("/");
    }

    const fetchTab = async () => {
      const response = await axiosClient.get(`/tabs/${code}/owner_name`);
      setTabOwner(response.data.owner_name);
      setIsLoading(false);
    };
    fetchTab();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full bg-purple-200">
        <ClipLoader color="grey" size={30} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-purple-200">
      <div className="bg-white p-15 py-5 flex flex-col items-center justify-center rounded-2xl w-[80%] shadow-lg">
        <img
          src={logo}
          className="w-32 h-32 mb-6 flex items-center justify-center"
        />

        <h1 className="text-2xl text-center font-bold mb-2">
          Join {tabOwner}'s Tab
        </h1>
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
