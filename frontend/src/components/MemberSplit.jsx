
function MemberSplit({name, amount}) {
  return (
    <div className="my-2 ml-2 relative flex flex-row">
      <p>{name}</p>
      <p className="absolute right-5">${amount}</p>
    </div>
  )
}

export default MemberSplit;
