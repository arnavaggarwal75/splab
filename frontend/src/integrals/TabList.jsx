import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import axiosClient from "../api/axiosClient";
import BillItem from "../components/BillItem";
import AvatarCircles from "../components/AvatarCircles";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { RotatingLines } from "react-loader-spinner";
import { useUser } from "../contexts/UserContext";
import logo from "../assets/logo.png";

function TabList() {
  let [searchParams] = useSearchParams();
  let navigate = useNavigate();

  const { currentSocketRef, connectToSocket } = useSocket();
  const { user, setUser } = useUser();
  const joinedTab = useRef(false);

  const [items, setItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [tip, setTip] = useState("");
  const [share, setShare] = useState(0);
  const [members, setMembers] = useState([]);
  const [ownerName, setOwnerName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isWaiting, setIsWaiting] = useState(false);

  const getFirstName = (name) => {
    return name.split(" ")[0];
  };

  const handleCheckbox = (index) => {
    const newCheckedState = !checkedItems[index];
    console.log(checkedItems);
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
    currentSocketRef.current.emit("update_checkbox", {
      checked: newCheckedState,
      tab_id: searchParams.get("code"),
      item_id: index,
      member_id: user.memberId,
      member_name: user.name,
    });
  };

  const handleSubmit = () => {
    setIsWaiting(true);
    currentSocketRef.current.emit("submit", {
      tab_id: searchParams.get("code"),
      member_id: user.memberId,
      tip: tip,
    });
  };

  // initial useEffect
  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      navigate("/");
      return;
    }

    const getMemberId = async () => {
      const tabId = localStorage.getItem("tabId");
      if (tabId == code) {
        const memberId = localStorage.getItem("memberId");
        const response = await axiosClient.get(
          `/tabs/${code}/members/${memberId}`
        );
        const member = response.data.member;
        if (user.joined && member.name !== user.name) {
          console.log("Updating name since member name was " + member.name + " and user name is " + user.name);
          axiosClient.put(`/tabs/member_name/${code}/${memberId}`, {
            name: user.name,
          });
        }
        setUser((prev) => ({
          ...prev,
          name: user.joined ? user.name : member.name,
          paymentInfo: member.payment_info,
          isOwner: member.is_owner,
          memberId,
        }));
        console.log(member.name, memberId);
        return false;
      }
      return true;
    };

    const joinTab = async () => {
      console.log("Joining tab");
      const response = await axiosClient.post("/tabs/add_member", {
        tab_id: code,
        name: user.name,
        is_owner: user.isOwner,
        payment_info: user.paymentInfo,
      });
      const memberId = response.data.member_id;
      localStorage.setItem("memberId", memberId);
      localStorage.setItem("tabId", code);
      setUser((prev) => ({ ...prev, memberId }));
    };
    (async () => {
      const needToJoin = await getMemberId();
      if (!joinedTab.current && needToJoin) {
        joinedTab.current = true;
        await joinTab();
      }
    })();
  }, []);

  // useEffect after getting user.memberId
  useEffect(() => {
    if(!user.memberId) return;
    const code = searchParams.get("code");
    const getTabInfo = async () => {
      // get items + tab info
      axiosClient.get(`/tabs/info/${code}`).then((response) => {
        response.data.items.forEach((item) => {
          if (item.members == null) return;
          if (item.members.some((member) => member.id == user.memberId)) {
            setCheckedItems((prev) => ({
              ...prev,
              [item.id]: true,
            }));
          }
        })

        setMembers([]);
        response.data.members.forEach((member) => {
          if(member.online || member.name == user.name) {
            setMembers(prev => [...prev, member.name]);
          }
        })

        setItems(response.data.items);
        setOwnerName(response.data.owner_name);
        setIsLoading(false);
      });
    };

    const connect = async () => {
      console.log("Starting connect", user.memberId);
      // connect to socket
      connectToSocket(user.memberId, code);

      // setup snapshots
      const membersCollectionRef = collection(
        db,
        "Tabs",
        searchParams.get("code"),
        "members"
      );
      const unsubscribeMemberList = onSnapshot(
        membersCollectionRef,
        (collectionSnap) => {
          setMembers([]);
          collectionSnap.forEach((member) => {
            if (member.data().online || member.data().name == user.name) {
              setMembers(prev => [...prev, member.data().name]);
            }
          });
        }
      );

      const memberDocRef = doc(
        db,
        "Tabs",
        searchParams.get("code"),
        "members",
        user.memberId
      );
      const unsubscribeShare = onSnapshot(memberDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.share !== undefined) {
            setShare(data.share);
          }
        } else {
          console.warn("Member document not found");
        }
      });

      const itemsCollectionRef = collection(db, "Tabs", code, "items");
      const unsubscribeItems = onSnapshot(itemsCollectionRef, (snapshot) => {
        const updatedItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(updatedItems);
      });

      return () => {
        unsubscribeMemberList();
        unsubscribeShare();
        unsubscribeItems();
      };
    }
    getTabInfo();
    let unsubscribe = () => {};
    (async () => {
      unsubscribe = await connect();
    })();

    return unsubscribe;
  }, [user.memberId]);

  // useEffect for all submitted socket handler
  useEffect(() => {
    const socket = currentSocketRef.current;
    if (!socket) return;
    const code = searchParams.get("code");
    socket.on("all_submitted", () => {
      console.log("🎉 All submitted!");
      if (user.isOwner) {
        navigate("/owner-final?code=" + code);
      } else {
        navigate(`/member-final?code=${code}`);
      }
    });
  }, [currentSocketRef.current, user.memberId, user.isOwner]);

  if (isLoading) {
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
    <div className="flex flex-col items-center h-screen bg-white relative font-mono">
      <h1 className="mt-3 text-lg font-bold">
        {user.isOwner ? "Your Tab" : ownerName + "'s Tab"}
      </h1>
      <h2 className="text-sm">{searchParams.get("code")}</h2>

      <div
        className={`h-10 mb-3 transition-opacity duration-300 ${members.length > 0 ? "opacity-100" : "opacity-0"}`}
      >
        <AvatarCircles members={members} />
      </div>

      <div className="flex-1 overflow-y-auto w-[86%] scrollnone flex flex-col gap-2 pt-2 pb-32">
        {items ? (
          items.map((item, idx) => (
            <BillItem
              key={item.id}
              index={idx + 1}
              name={item.name}
              price={item.price}
              isChecked={!!checkedItems[item.id]}
              handleCheckbox={() => handleCheckbox(item.id)}
              checkedBy={
                item.members
                  ? item.members.map((member) => getFirstName(member.name))
                  : []
              }
            />
          ))
        ) : (
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="30"
            visible={true}
          />
        )}
      </div>

      <div className="fixed bottom-0 w-full bg-white/70 backdrop-blur-md border-t border-gray-300 shadow-xl">
        <div className="flex justify-center py-2">
          <span className="text-black text-lg font-semibold">
            You owe: ${(Math.round(share * 100) / 100).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-evenly px-6 py-4">
          <input
            type="text"
            inputMode="decimal"
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
      {isWaiting && (
        <div className="absolute top-0 left-0 w-full h-full bg-white/20 backdrop-blur-md z-50 flex flex-col items-center justify-center">
          <img
            src={logo}
            className="w-20 h-20 mb-4 animate-bounce"
            alt="Waiting"
          />
          <p className="text-lg font-semibold text-gray-700">
            Waiting for everyone to submit...
          </p>
        </div>
      )}
    </div>
  );
}

export default TabList;
