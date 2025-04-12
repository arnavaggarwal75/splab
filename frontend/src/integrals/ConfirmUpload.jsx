import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import axiosClient from "../api/axiosClient";
import BillItem from "../components/BillItem";

function ConfirmUpload() {
  const [items, setItems] = useState(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    (async () => {
      const imageUrl = searchParams.get("image");
      if(!imageUrl) {
        navigate('/');
      }
      
      const formData = new FormData();
      try {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const file = new File([blob], "recipt.jpg", {type: blob.type})
        formData.append("file", file);
      } catch(error) {
        navigate('/upload');
        return;
      } 
      const response = await axiosClient.post("/ocr/extract", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const newItems = []
      for(const item of response.data.items) {
        for(let i = 0; i < parseInt(item[2]); i++) {
          newItems.push({
            name: item[0],
            price: parseFloat(item[1]),
          })
        }
      }
      setItems(newItems);
    })();
  }, [])

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
          <h1 className="text-center text-lg font-bold">
            Loading...
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
          onClick={() => navigate("/get-link")}
          className="px-15 py-3 bg-[var(--primary)] text-white rounded-full shadow transition"
        >
          Proceed
        </button>
      </div>
    </div>
  );
}

export default ConfirmUpload;
