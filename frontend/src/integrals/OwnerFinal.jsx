import MemberSplit from "../components/MemberSplit";
import logo from "../assets/logo.png";

function OwnerFinal() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-200 px-8 text-center font-mono">
      <div className="bg-white p-8 py-6 flex flex-col items-center justify-center rounded-2xl w-[80%] shadow-lg">
        <img
          src={logo}
          className="w-24 h-24 mb-4 flex items-center justify-center"
        />

        <h1 className="text-2xl font-bold mb-4">Split Summary</h1>
        <p className="text-gray-500 text-sm mb-6">Here’s how much each member owes you</p>

        <div className="w-full flex flex-col gap-2 border-t border-gray-300 overflow-y-scroll max-h-64">
          <MemberSplit name="Andy" amount={35.4} />
          <MemberSplit name="Ishani" amount={12.75} />
          <MemberSplit name="Cheng" amount={9.99} />
          <MemberSplit name="Arnav" amount={18.0} />
          <MemberSplit name="Arnav" amount={18.0} />
          <MemberSplit name="Arnav" amount={18.0} />
          <MemberSplit name="Arnav" amount={18.0} />
          <MemberSplit name="Arnav" amount={18.0} />
          <MemberSplit name="Arnav" amount={18.0} />
          <MemberSplit name="Arnav" amount={18.0} />
          <MemberSplit name="Arnav" amount={18.0} />
          <MemberSplit name="Arnav" amount={18.0} />
          <MemberSplit name="Arnav" amount={18.0} />
          <MemberSplit name="Arnav" amount={18.0} />
          <MemberSplit name="Arnav" amount={18.0} />

        </div>
      </div>
    </div>
  );
}

export default OwnerFinal;
