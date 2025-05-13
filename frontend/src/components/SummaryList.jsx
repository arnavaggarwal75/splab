import React, { useState, useEffect } from "react";

import { FaCaretRight } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";

import { roundMoney } from "../utils/formatMoney.js";

function SummaryList({
  summary,
  total = false,
  borderTop = false,
  borderBottom = false,
  fullWidth = false
}) {
  const [expanded, setExpanded] = useState({});

  if (!summary) {
    return;
  }
  let sum = 0;
  summary.forEach((item, index) => {
    if (item && item.inner) {
      let innerSum = 0;
      item.inner.forEach(innerItem => {
        innerSum += parseFloat(innerItem.amount);
      })
      sum += innerSum;
      summary[index].amount = innerSum;
    } else {
      sum += parseFloat(item.amount)
    }
  })
  if (total && summary[summary.length - 1].name !== "Total") {
    summary.push({ name: "Total", amount: sum })
  }

  return (
    <div className={`${borderTop ? "border-t" : ""} ${borderBottom ? "border-b" : ""} py-4 border-gray-300 w-full flex flex-col gap-1 items-center`}>
      {summary.map((item, index) =>
        <div key={index} className={`${fullWidth ? "w-full" : "w-[80%]"}`}>
          {'inner' in item ? (
            expanded[item.name] ? (
              <div className="w-full">
                <div className="w-full flex items-center flex-wrap">
                  <FaCaretDown className="absolute -translate-x-5 -translate-y-[0.1em]" onClick={
                    () => setExpanded(prev => ({ ...prev, [item.name]: false }))
                  } />
                  <ItemRow name={item.name} amount={item.amount} />
                </div>
                <div className="flex flex-col w-full">
                  {item.inner.map((innerItem, innerIndex) =>
                    <ItemRow key={innerIndex} name={innerItem.name} amount={innerItem.amount} indent />
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full flex items-center flex-wrap">
                <FaCaretRight className="absolute -translate-x-5" onClick={
                  () => setExpanded(prev => ({ ...prev, [item.name]: true }))
                } />
                <ItemRow name={item.name} amount={item.amount} />
              </div>
            )
          ) : (
            <ItemRow name={item.name} amount={item.amount} />
          )}
        </div>
      )}
    </div>
  );
}

function ItemRow({ name, amount, indent }) {
  return (
    <div className="w-full flex flex-row justify-between">
      <div className="w-[70%] flex flex-row">
        <p className={`${indent ? "ml-[5%]" : ""} truncate`}>{name}</p>
        <p>:</p>
      </div>
      <p className="font-bold">${roundMoney(amount)}</p>
    </div>
  )
}

export default SummaryList;  
