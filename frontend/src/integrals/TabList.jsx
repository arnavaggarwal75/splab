import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import axiosClient from "../api/axiosClient";
import BillItem from "../components/BillItem";
import AvatarCircles from "../components/AvatarCircles";

function TabList() {
  let [searchParams, setSearchParams] = useSearchParams();
  let navigate = useNavigate();
  const { currentSocket, connectToSocket } = useSocket();

  const [items, setItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [tip, setTip] = useState("");

  const members = [
    "Arnav Aggarwal",
    "Ishani Mehra",
    "Cheng Li",
    "Siddharth Gupta",
    "Siddharth Gupta",
    "Siddharth Gupta",
    "Siddharth Gupta",
    "Siddharth Gupta",
    "Siddharth Gupta",
    "Siddharth Gupta",
    "Siddharth Gupta",
    "Siddharth Gupta",
    "Siddharth Gupta",
  ];


  const handleCheckbox = (index) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSubmit = () => {
    alert(`Tip: ${tip || 0}, Checked Items: ${JSON.stringify(checkedItems)}`);
  };

  useEffect(() => {
    // set up socket
    const code = searchParams.get("code");
    if (!code) {
      navigate("/");
    }
    connectToSocket(code);

    // get items
    axiosClient.get(`/tabs/${code}`).then((response) => {
      console.log(response)
      setItems(response.data.items)
    })
  }, []);

  return (
    <div className="flex flex-col items-center h-screen bg-white relative font-mono">
      <h1 className="mt-3 text-lg font-bold">Your Tab</h1>
      <h2 className="text-sm">{searchParams.get("code")}</h2>

      {members.length > 0 && <AvatarCircles members={members} />}

      <div className="flex-1 overflow-y-auto w-[86%] scrollnone flex flex-col gap-2 pb-24">
        {items ? items.map((item, idx) => (
          <BillItem
            key={item.id}
            index={idx + 1}
            name={item.name}
            price={item.price}
            isChecked={!!checkedItems[item.id]}
            handleCheckbox={() => handleCheckbox(item.id)}
          />
        )) : <h1>Is Loading</h1>}
      </div>

      <div className="fixed bottom-0 w-full bg-white/70 backdrop-blur-md border-t border-gray-300 flex items-center justify-evenly px-6 py-4 shadow-xl">
        <input
          type="number"
          value={tip}
          onChange={(e) => setTip(e.target.value)}
          placeholder="Tip ($)"
          className="border border-[var(--primary)] text-center rounded-full p-2 w-24 text-sm bg-white/70 backdrop-blur-sm focus:outline-none"
        />
        <button
          onClick={handleSubmit}
          className="px-6 py-2 rounded-full text-white font-semibold shadow-md bg-[var(--secondary)] transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default TabList;
