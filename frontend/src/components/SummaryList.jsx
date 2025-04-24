import { roundMoney } from "../utils/formatMoney.js";

function SummaryList({
  summary,
  total = false,
  borderTop = false,
  borderBottom = false,
  fullWidth = false
}) {
  if (total && summary[summary.length - 1].name !== "Total") {
    let sum = 0;
    summary.forEach(item => sum += parseFloat(item.amount))
    summary.push({ name: "Total", amount: sum })
  }
  return (
    <div className={`${borderTop ? "border-t" : ""} ${borderBottom ? "border-b" : ""} py-4 border-gray-300 w-full flex flex-col gap-1 items-center`}>
      {summary.map((object, index) =>
        <div key={index} className={`flex flex-row justify-between ${fullWidth ? "w-full" : "w-[80%]"}`}>
          <p>{object.name}:</p>
          <p className="font-bold">${roundMoney(object.amount)}</p>
        </div>
      )}
    </div>
  );
}

export default SummaryList;  
