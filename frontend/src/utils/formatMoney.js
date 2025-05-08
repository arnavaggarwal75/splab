export const roundMoney = (amount) => {
  if(!amount) {
    return "0.00";
  }
  return (Math.round(parseFloat(amount) * 100) / 100).toFixed(2);
}

export const sumMoney = (amounts) => {
  let sum = 0;
  amounts.forEach(curr => {
    sum += parseFloat(curr);
  })
  return (Math.round(parseFloat(sum) * 100) / 100).toFixed(2);
}
