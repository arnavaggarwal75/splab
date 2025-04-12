import { useState, useEffect } from "react";

import axios from "axios";

import BillItem from "../components/BillItem";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useSocket } from "../contexts/SocketContext";

function ConfirmUpload() {
  const [items, setItems] = useState([]);
  const { setUser, user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const imageFile = location.state?.imageFile; // Retrieve the file
  const [blobUrl, setBlobUrl] = useState(null);
  const { socket } = useSocket();

  function handleProceed() {
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/tabs/create`, { amount: 0 })
      .then((response) => {
        setUser({ items });
        const tabId = response.data.tab_id;
        items.forEach((item) => {
          axios
            .post(`${import.meta.env.VITE_BACKEND_URL}/items/create`, {
              tab_id: tabId,
              item_total: item.price,
            })
            .then((res) => {
              console.log("Item created:", res.data);
            })
            .catch((err) => {
              console.error("Error creating item:", err.message);
            });
        });
        axios
          .post(`${import.meta.env.VITE_BACKEND_URL}/users/create`)
          .then((response) => {
            setUser({
              ...user,
              id: response.data.user_id,
            });
            socket.emit("join_tab", {
              tab_id: tabId,
              user_id: response.data.user_id,
              user_name: user.name,
              isOwner: true,
            });
            navigate(`/get-link?code=${tabId}`);
          });
      })
      .catch((error) => {
        console.log("Error: " + error.message);
      });
  }

  useEffect(() => {
    if (!imageFile) {
      navigate("/");
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setBlobUrl(url);

    return () => URL.revokeObjectURL(url); // Cleanup
  }, [imageFile]);

  useEffect(() => {
    if (!blobUrl) return;

    (async () => {
      try {
        const imageResponse = await fetch(blobUrl);
        const blob = await imageResponse.blob();
        const file = new File([blob], "receipt.jpg", { type: blob.type });

        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(
          `${import.meta.env.VITE_OCR_URL}/extract-receipt-info/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        const rawItems = response.data.data.items;
        const formattedItems = rawItems.map((item) => ({
          name: item[0],
          price: parseFloat(item[1]),
        }));
        setItems(formattedItems);
      } catch (error) {
        console.error("Error uploading receipt:", error);
      }
    })();
  }, [blobUrl]);

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
          <h1 className="text-lg font-bold">
            Items were unable to be recognized... try again!
          </h1>
        )}
      </div>
      <div className="fixed bottom-0 flex justify-evenly px-6 py-4 shadow-xl items-center bg-white/70 backdrop-blur-md border-t border-gray-300 w-full">
        <button
          onClick={() => navigate("/upload")}
          className="px-15 py-3 bg-[var(--primary)] text-white rounded-full shadow transition"
        >
          Back
        </button>
        <button
          onClick={() => handleProceed()}
          className="px-15 py-3 bg-[var(--primary)] text-white rounded-full shadow transition"
        >
          Proceed
        </button>
      </div>
    </div>
  );
}

export default ConfirmUpload;
