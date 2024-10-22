// src/App.js
import  "./App.css"
import React, { Suspense, lazy, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DarkModeContext } from "./context/darkModeContext";
import Layout from "./components/Layout/Layout"; // Import the Layout component
import "./style/dark.scss";
import {userInputs} from "./formSource"
import { Block } from "@mui/icons-material";
import BlockList from "./pages/list/BlockList";
import DispositionList from "./pages/list/DispositionList";
import IVRList from "./pages/list/IVRcoverterList";
const LeadReportList =lazy(()=>import("./pages/list/LeadReportList")) ;
const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/login/Login"));
const List = lazy(() => import("./pages/list/List"));
const Single = lazy(() => import("./pages/single/Single"));
const New = lazy(() => import("./pages/new/New"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const EditProfile = lazy(() => import("./pages/Profile/EditPro"));
const CompaignList = lazy(() => import("./pages/list/CompaignList"));
const NewCompaign = lazy(() => import("./pages/new/NewCompaign"));
const GroupList = lazy(() => import("./pages/list/GroupList"));
const CallReport = lazy(()=>import("./pages/list/CallReportList"))
const MenuList = lazy(()=>import("./pages/list/Menu_IVR_List"));
const NewGroup= lazy(()=>import("./pages/new/NewGroup"))
const CompaignPage = lazy(()=>import("./pages/Compaign/CompaignPage"));
const DataUpload= lazy(()=>import("./pages/DataUploadPage/dataUpload"))

function App() {
  const { darkMode } = useContext(DarkModeContext);
  

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>

            
   
          <Routes>
          <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
             
              <Route path="edit_Profile" element={<EditProfile />} />
              <Route path="userProfile" element={<Profile />} />
              <Route path="users">
                <Route index element={<List />} />
                <Route path=":userId" element={<Single />} />
                <Route
                  path="new"
                  element={<New inputs={userInputs} title="Add New User" />}
                />
              </Route>
              <Route path="campaign">
                  <Route index element={<CompaignPage/>} />
                  <Route path=":newCampaign" element={<Single />} />
                <Route
                  path="newCampaign"
                  element={<NewCompaign />}
                />
              </Route>
              <Route path="group">
                <Route index element={<GroupList />} />
                <Route path="newGroup" element={<NewGroup/>} />
              </Route>
              <Route path="dataupload">
                <Route index element={<DataUpload/>} />
                <Route to="" />
              </Route>
              <Route path="menu_ivr">
                <Route index element={<MenuList/>} />
                <Route to="" />
              </Route>
              <Route path="call_report">
                <Route index element={<CallReport/>} />
                <Route to="" />
              </Route>
              <Route path="leadReportList">
                <Route index element={<LeadReportList/>} />
                <Route to="" />
              </Route>
              <Route path="blockList">
                <Route index element={<BlockList/>} />
                <Route to="" />
              </Route>
              <Route path="dispositionList">
                <Route index element={<DispositionList/>} />
                <Route to="" />
              </Route>
              <Route path="ivrList">
                <Route index element={<IVRList/>} />
                <Route to="" />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
