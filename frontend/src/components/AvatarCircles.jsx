import React, { useContext, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { useUser } from "../contexts/UserContext";

const colors = [
  "bg-red-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-yellow-400",
  "bg-orange-400",
];

function AvatarCircles({ members, isExpanded }) {
  const maxVisible = 5;
  const visibleMembers = members.slice(0, maxVisible);
  const extraCount = members.length - maxVisible;
  const { name: currentName } = useUser();

  useEffect(() => {
    console.log("AvatarCircles rendered with members:", members);
    console.log("Current user name:", currentName);
  }, [members, currentName]);

  return (
    <div className="relative mt-2 mb-3">
      <div className="flex relative gap-0">
        {visibleMembers.map((name, index) => {
          const initials = name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
          const color = colors[index % colors.length];

          return (
            <div
              key={index}
              className={`border border-black/10 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${color} ${
                index !== 0 ? "-ml-2" : ""
              }`}
            >
              {initials}
            </div>
          );
        })}

        {extraCount > 0 && (
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-400 text-white text-xs font-bold -ml-2">
            +{extraCount}
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="flex-col gap-1 absolute top-10 w-44 max-h z-10 bg-white border border-black/10 rounded-lg shadow-lg p-2">
          {members.map((name, index) => {
            return (
              <div className="flex items-center justify-between" key={index}>
                <div
                  className={`flex items-center font-bold font-mono px-4 py-2`}
                >
                  {name}
                </div>
                {name !== currentName && <RxCross2 />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AvatarCircles;
