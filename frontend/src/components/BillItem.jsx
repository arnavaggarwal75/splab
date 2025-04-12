import NameTag from "./NameTag";

function BillItem({
  index,
  name,
  price,
  isChecked,
  handleCheckbox,
  checkedBy = [],
  checkboxDisabled,
}) {
  return (
    <div className="flex flex-col gap-2 relative  w-full p-4 bg-gray-300/20 backdrop-blur-sm text-black font-bold rounded-xl shadow-lg border border-gray-300 font-mono">
      <div className="flex items-center">
        <p className="mr-4 text-sm opacity-70">{index}.</p>
        <p className="flex-1 font-normal text-sm tracking-wide">{name}</p>
        <p className="mr-4 text-sm font-bold text-secondary">${price}</p>
        {checkboxDisabled ? (
          <></>
        ) : (
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => handleCheckbox(e.target.value)}
            className="w-5 h-5 rounded-xl border-2 border-[var(--primary)] bg-white checked:bg-[var(--secondary)] appearance-none "
          />
        )}
      </div>

      {checkedBy.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {checkedBy.map((person, index) => (
            <NameTag key={index} name={person} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BillItem;
