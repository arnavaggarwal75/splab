import React from "react";

const colors = [
  "bg-red-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-yellow-400",
  "bg-orange-400",
];

function AvatarCircles({ members }) {
  const maxVisible = 5;
  const visibleMembers = members.slice(0, maxVisible);
  const extraCount = members.length - maxVisible;

  return (
    <div className="flex gap-0 mt-2 mb-3">
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
            className={`border-1 border-black/10 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${color} ${
              index !== 0 ? "-ml-2" : ""}`}
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
  );
}

export default AvatarCircles;
