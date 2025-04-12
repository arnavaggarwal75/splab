import "./style.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./integrals/Home";
import TabList from "./integrals/TabList";
import MemberFinal from "./integrals/MemberFinal";
import Upload from "./integrals/Upload";
import ConfirmUpload from "./integrals/ConfirmUpload";
import MemberHome from "./integrals/MemberHome";
import GetLink from "./integrals/GetLink";
import OwnerFinal from "./integrals/OwnerFinal";

function App() {
  return (
    <div className="h-full">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tab-list" element={<TabList />}/>
          <Route path="/owner-final" element={<OwnerFinal />} />
          <Route path="/member-final" element={<MemberFinal />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/confirm-upload" element={<ConfirmUpload />} />
          <Route path="/member-home" element={<MemberHome />} /> 
          <Route path="/get-link" element={<GetLink />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
