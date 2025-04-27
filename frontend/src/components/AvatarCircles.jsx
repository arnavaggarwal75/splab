import React, { useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { useUser } from "../contexts/UserContext";

const colors = [
  "bg-red-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-yellow-400",
  "bg-orange-400",
];

function AvatarCircles({ members, isExpanded, onRemoveMember }) {
  const maxVisible = 5;
  const visibleMembers = members.slice(0, maxVisible);
  const extraCount = members.length - maxVisible;
  const { user } = useUser();
  const currentName = user.name;

  return (
    <div className="relative mt-2 mb-3">
      <div className="flex relative gap-0">
        {visibleMembers.map((member, index) => {
          const initials = member.name
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
        <div className="flex-col flex gap-2 absolute top-10 left-1/2 -translate-x-1/2 w-56 max-h-56 overflow-y-scroll z-10 bg-white border border-black/10 rounded-lg shadow-lg py-3">
          {members.map((member, index) => {
            return (
              <div
                className="flex items-center justify-between px-4"
                key={index}
              >
                <div className={`flex items-center font-mono`}>{member.name}</div>
                {member.name !== currentName && (
                  <button
                    className="btn-pressable"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveMember(member.id);
                    }}
                  >
                    <RxCross2 />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AvatarCircles;
