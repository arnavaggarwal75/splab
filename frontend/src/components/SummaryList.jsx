function SummaryList({ summary, borderTop = false, borderBottom = false }) {
  return (
    <div className={`${borderTop ? "border-t" : ""} ${borderBottom ? "border-b" : ""} py-4 border-t border-gray-300 w-full flex flex-col gap-1 items-center`}>
      {summary.map((object, index) =>
        <div key={index} className="flex flex-row justify-between w-[80%]">
          <p>{object.name}:</p>
          <p className="font-bold">${(Math.round(parseFloat(object.amount) * 100) / 100).toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default SummaryList;  
