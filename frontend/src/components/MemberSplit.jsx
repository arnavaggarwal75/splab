function MemberSplit({ name, share, submitted }) {
  return (
    <div className="my-2 ml-2 relative flex flex-row items-center justify-between overflow-scroll">
      {/* Disabled checkbox on the left */}
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={submitted}
          disabled
          className="w-4 h-4 rounded-md border-2 border-[var(--primary)] bg-white checked:bg-green-400 appearance-none "
        />
        {/* Member name comes after the checkbox */}
        <p className="ml-3">{name}</p>
      </div>
      {/* Share amount stays aligned to the right */}
      <p className="">${share}</p>
    </div>
  );
}

export default MemberSplit;
