import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { RotatingLines } from "react-loader-spinner";
import { useUser } from "../contexts/UserContext";
import axiosClient from "../api/axiosClient";
import { sumMoney, roundMoney } from "../utils/formatMoney.js";
import SummaryList from "../components/SummaryList";

const MemberFinal = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const [tip, setTip] = useState(null);
  const [tax, setTax] = useState(null);
  const [subtotal, setSubtotal] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const paymentComplete = () => {
    const code = searchParams.get("code");
    if (!code) {
      navigate("/");
    }
    axiosClient.post(`/tabs/mark_paid/${code}/${user.memberId}`).then((response) => {
      navigate("/member-success?code=" + code + "&member_id=" + user.memberId);
    }).catch((error) => {
      alert("Something went wrong", error);
    });
  };

  useEffect(() => {
    if(!user) {
      return;
    }
    const code = searchParams.get("code");
    if (!code) {
      navigate("/");
      return;
    }
    axiosClient.get(`/tabs/share/${code}/${user.memberId}`).then((response) => {
      setTax(response.data.member.tax);
      setTip(response.data.member.tip);
      setSubtotal(response.data.member.share);
      setPaymentInfo(response.data.payment_info);
    });
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-200 px-8 text-center font-mono">
      <div className="bg-white p-8 py-6 flex flex-col items-center justify-center rounded-2xl w-[80%] shadow-lg">
        <img
          src={logo}
          className="w-24 h-24 mb-4 flex items-center justify-center"
        />
        {subtotal ? (
          <div className="w-full">
            <p className="text-lg mb-2">Please transfer your share to</p>
            <div className="my-4 mx-auto bg-gray-100 shadow-inner p-2 rounded-2xl text-gray-800 text-md w-full max-w-xs">
              {paymentInfo}
            </div>
            <SummaryList borderTop borderBottom summary={[
              { name: "Subtotal", amount: subtotal },
              { name: "Tax", amount: tax },
              { name: "Tip", amount: tip },
            ]} />
            <p className="text-lg mt-4">You owe:</p>
            <p className="text-4xl font-bold mt-2">${sumMoney([subtotal, tax, tip])}</p>
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
