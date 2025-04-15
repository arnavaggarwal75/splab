import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import axiosClient from "../api/axiosClient";
import { useUser } from "../contexts/UserContext";
import BillItem from "../components/BillItem";

function ConfirmUpload() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, setUser } = useUser();

  const [items, setItems] = useState(null);

  useEffect(() => {
    (async () => {
      const imageUrl = searchParams.get("image");
      if (!imageUrl) {
        navigate("/");
      }

      const formData = new FormData();
      try {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const file = new File([blob], "recipt.jpg", { type: blob.type });
        formData.append("file", file);
      } catch (error) {
        navigate("/upload");
        return;
      }
      const response = await axiosClient.post("/ocr/extract", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newItems = [];
      for (const item of response.data.items) {
        for (let i = 0; i < parseInt(item[2]); i++) {
          newItems.push({
            name: item[0],
            price: parseFloat(item[1]),
          });
        }
      }
      setItems(newItems);
    })();
  }, []);

  const createTab = () => {
    console.log(user.name);
    axiosClient.post("/tabs/create", {
      owner_name: user.name,
      owner_payment_id: user.paymentInfo,
      items,
    }).then((response) => {
      navigate(`/get-link?code=${response.data.tab_id}`);
    });
  };

  return (
    <div className="relative h-screen flex flex-col items-center font-mono bg-white">
      <h1 className="m-5 text-lg font-bold">Does this look good?</h1>
      <div className="flex-1 overflow-y-auto w-[86%] scrollnone flex flex-col gap-2 pb-24">
        {items ? (
          items.map((item, index) => (
            <BillItem
              key={index}
              index={index + 1}
              name={item.name}
              price={item.price}
              checkboxDisabled
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <RotatingLines
              strokeColor="grey"
              strokeWidth="5"
              animationDuration="0.75"
              width="30"
              visible={true}
            />
          </div>
        )}
      </div>
      <div className="fixed bottom-0 flex justify-evenly px-6 py-4 shadow-xl items-center bg-white/70 backdrop-blur-md border-t border-gray-300 w-full">
        <button
          onClick={() => navigate("/upload")}
          className="px-[10%] py-3 bg-[var(--primary)] text-white rounded-full shadow transition btn-pressable"
        >
          Back
        </button>
        <button
          onClick={createTab}
          className="px-[10%] py-3 bg-[var(--primary)] text-white rounded-full shadow transition btn-pressable"
        >
          Proceed
        </button>
      </div>
    </div>
  );
}

export default ConfirmUpload;
