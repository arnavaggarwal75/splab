import React, { useEffect, useState } from "react";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import {RotatingLines} from 'react-loader-spinner'

const StripeOnboarding = () => {
  const [stripeConnectInstance, setStripeConnectInstance] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const init = async () => {
      const fetchClientSecret = async () => {
        const resp = await axiosClient.post("stripe/onboard", {
          tab_id: searchParams.get("code"),
        });
        const { client_secret } = resp.data;
        return client_secret;
      };
      const instance = await loadConnectAndInitialize({
        publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
        fetchClientSecret,
      });
      setStripeConnectInstance(instance);
    };
    init();
  }, []);

  if (!stripeConnectInstance) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="30"
          visible={true}
        />
      </div>
    );
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-100 px-4 py-4 font-mono">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4 text-center">Lets quickly set up your payout account</h2>
        <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
          <ConnectAccountOnboarding
            onExit={() => {
              navigate(`/get-link?code=${searchParams.get("code")}`);
            }}
          />
        </ConnectComponentsProvider>
      </div>
    </div>
  );
};

export default StripeOnboarding;
