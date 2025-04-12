import { useState } from "react";

import BillItem from "../components/BillItem";
import { useNavigate } from "react-router-dom";

function ConfirmUpload() {
  const [items, setItems] = useState([
    { name: "potato", price: 5 },
    { name: "chicken", price: 6 },
    { name: "chicken", price: 6 },
    { name: "chicken", price: 6 },
    { name: "chicken", price: 6 },
    { name: "chicken", price: 6 },
    { name: "chicken", price: 6 },
    { name: "chicken", price: 6 },
    { name: "chicken", price: 6 },
    { name: "chicken", price: 6 },
    { name: "chicken", price: 6 },
    { name: "chicken", price: 6 },
    { name: "chicken", price: 6 },
    { name: "chicken", price: 6 },
    { name: "chicken", price: 6 },
    { name: "chicken", price: 6 },
    { name: "chicken", price: 6 },
    { name: "chicken", price: 6 },
  ]);
  const navigate = useNavigate();

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
