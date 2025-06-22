import "./style.css";

import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useUser } from "./contexts/UserContext";
import { useKeyboardFix } from "./utils/keyboardFix";
import Home from "./integrals/Home";
import TabList from "./integrals/TabList";
import MemberFinal from "./integrals/MemberFinal";
import Upload from "./integrals/Upload";
import ConfirmUpload from "./integrals/ConfirmUpload";
import MemberHome from "./integrals/MemberHome";
import GetLink from "./integrals/GetLink";
import OwnerFinal from "./integrals/OwnerFinal";
import MemberSuccess from "./integrals/MemberSuccess";

function App() {
  useKeyboardFix();

  const { user, restoreUser } = useUser();
  useEffect(() => {
    restoreUser();
  }, []);

  useEffect(() => {
    if(!user) return;
    console.log("User restored", user);
  }, [user])

  return (
    <div className="h-[100svh] overflow-hidden fixed inset-0">
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
          <Route path="/member-success" element={<MemberSuccess />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
