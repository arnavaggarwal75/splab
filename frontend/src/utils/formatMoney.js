export const roundMoney = (amount) => {
  if(!amount) {
    return "0.00";
  }
  return (Math.round(parseFloat(amount) * 100) / 100).toFixed(2);
}

export const sumMoney = (amounts) => {
  console.log(amounts)
  let sum = 0;
  amounts.forEach(curr => {
    if(Array.isArray(curr)) {
      curr.forEach(fee => {
        sum += parseFloat(fee.amount);
      })
    } else {
      sum += parseFloat(curr);
    }
  })
  return (Math.round(parseFloat(sum) * 100) / 100).toFixed(2);
}
