import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { RotatingLines } from "react-loader-spinner";
import { useUser } from "../contexts/UserContext";
import axiosClient from "../api/axiosClient";

const MemberFinal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [amount, setAmount] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const paymentComplete = () => {
    const code = searchParams.get("code");
    if (!code) {
      navigate("/");
    }
    axiosClient
      .post(`/tabs/mark_paid/${code}/${user.memberId}`)
      .then((response) => {
        alert("Thank you!");
      })
      .catch((error) => {
        alert("Something went wrong", error);
      });
  };

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      navigate("/");
    }
    axiosClient.get(`/tabs/share/${code}/${user.memberId}`).then((response) => {
      setAmount(response.data.share);
      setPaymentInfo(response.data.payment_info);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-200 px-8 text-center font-mono">
      <div className="bg-white p-8 py-6 flex flex-col items-center justify-center rounded-2xl w-[80%] shadow-lg">
        <img
          src={logo}
          className="w-24 h-24 mb-4 flex items-center justify-center"
        />
        {amount ? (
          <div>
            <p className="text-lg mb-2">Please transfer your share to</p>
            <div className="mt-2 bg-gray-100 shadow-inner p-2 rounded-2xl text-gray-800 text-md w-full max-w-xs">
              {paymentInfo}
            </div>

            <p className="text-lg mt-8">You owe:</p>
            <p className="text-4xl font-bold mt-2">${amount.toFixed(2)}</p>
          </div>
        ) : (
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="30"
            visible={true}
          />
        )}

        <button
          onClick={paymentComplete}
          className="mt-8 px-6 py-3 bg-[var(--primary)] text-white rounded-full shadow-md hover:opacity-90 transition text-sm font-semibold btn-pressable"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default MemberFinal;
