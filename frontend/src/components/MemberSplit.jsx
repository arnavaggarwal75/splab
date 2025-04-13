function MemberSplit({ name, share, submitted }) {
  return (
    <div className="my-2 ml-2 relative flex flex-row items-center">
      {/* Disabled checkbox on the left */}
      <input
        type="checkbox"
        checked={submitted}
        disabled
        className="w-4 h-4 cursor-default accent-green-500"
      />
      {/* Member name comes after the checkbox */}
      <p className="ml-2">{name}</p>
      {/* Share amount stays aligned to the right */}
      <p className="absolute right-5">${share}</p>
    </div>
  );
}

export default MemberSplit;
