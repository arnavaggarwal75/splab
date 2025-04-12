import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BillItem from "../components/BillItem";
import AvatarCircles from "../components/AvatarCircles";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import { useSocket } from "../contexts/SocketContext";

function TabList() {
  let [searchParams, setSearchParams] = useSearchParams();
  let navigate = useNavigate();
  const [tabId, setTabId] = useState("");
  const [items, setItems] = useState([]);
  const [members, setMembers] = useState([]);
  const { userId } = useUser();
  const { socket } = useSocket();

  const [checkedItems, setCheckedItems] = useState({});
  const [tip, setTip] = useState("");

  useEffect(() => {
    if (!searchParams.get("code")) {
      navigate("/");
    }
    const currTabId = searchParams.get("code");
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/tabs/${currTabId}/items`)
      .then((response) => {
        console.log(response.data.tab);
        setItems(response.data.tab);
      });
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/tabs/${currTabId}/members`)
      .then((response) => {
        setMembers(response.data.members);
      });
    setTabId(currTabId);
  }, []);

  useEffect(() => {
    socket.on("take_item", (data) => {
      const { item_id, user } = data;
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === item_id
            ? { ...item, taken_by: [...(item.taken_by || []), user] }
            : item
        )
      );
    });

    socket.on("join_tab", (data) => {
      const { user } = data;
      setMembers((prevMembers) => [...prevMembers, user]);
    });

    return () => {
      socket.off("take_item");
      socket.off("join_tab");
    };
  }, []);

  const handleCheckbox = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    socket.emit("take_item", {
      item_id: id,
      user_id: userId,
    });
  };

  const handleSubmit = () => {
    if (user.isOwner) {
      const memberTotals = {};

      items.forEach((item) => {
        if (item.taken_by && item.taken_by.length > 0) {
          item.taken_by.forEach((memberName) => {
            if (!memberTotals[memberName]) {
              memberTotals[memberName] = 0;
            }
            memberTotals[memberName] += item.price;
          });
        }
      });

      const tipAmount = parseFloat(tip) || 0;
      const tipPerMember = members.length > 0 ? tipAmount / members.length : 0;

      Object.keys(memberTotals).forEach((name) => {
        memberTotals[name] += tipPerMember;
      });

      navigate("/owner-final", { state: { splits: memberTotals } });
    } else {
      const myTotal = items
        .filter((item) => checkedItems[item.id])
        .reduce((acc, item) => acc + item.price, 0);

      const tipAmount = parseFloat(tip) || 0;
      const finalAmount = myTotal + tipAmount;

      navigate("/member-final", {
        state: { amount: finalAmount, zelleId: "johndoe@email.com" },
      });
    }
  };



  return (
    <div className="flex flex-col items-center h-screen bg-white relative font-mono">
      <h1 className="mt-3 text-lg font-bold">Your Tab</h1>
      <h2 className="text-sm">{searchParams.get("code")}</h2>

      {members?.length > 0 && <AvatarCircles members={members} />}

      <div className="flex-1 overflow-y-auto w-[86%] scrollnone flex flex-col gap-2 pb-24">
        {items.map((item, idx) => (
          <BillItem
            key={item.id}
            index={idx + 1}
            name={item.name}
            price={item.total}
            isChecked={!!checkedItems[item.id]}
            handleCheckbox={() => handleCheckbox(item.id)}
          />
        ))}
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
