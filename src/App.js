import "./App.css";
import "./style/dark.scss";
import axios from "axios";
import { useEffect, useContext, Suspense, lazy, useState } from "react";
import PrivateRoute from "./Routes/PrivateRoute";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Unauthorized from "./context/Unauth";
import { userInputs } from "./datatablesource";
import Logout from "./pages/login/logout";
import List from "./components/table/Table";
import { DarkModeContext } from "./context/darkModeContext";
import { Radio } from "react-loader-spinner";
import Datatable from "./components/datatable/Datatable";
import IVRList from "./pages/list/IVR_Converter/IVRcoverterList";
import AgentHome from "./pages/home/AgentsHome";
import AgentDataUpload from "./pages/DataUploadPage/AgentDataUpload";
import { UserPermissionsEditor } from "./pages/single/AdminControl.jsx";
import LeadFormModal from "./components/Form/LeadForm";
import VerificationModal from "./components/navbar/verify";
const ReminderTable = lazy(() => import("./components/table/AgentTable"));
const DidList = lazy(() => import("./components/Form/AllDid"));
const CreateAnnouncementForm = lazy(() =>
  import("./components/Form/Create_Announcement")
);
const CommunicationTypeSelector = lazy(() =>
  import("./components/SMS/Text_Template")
);

const UserDetailsTabs = lazy(() => import("./components/sidebar/UserDetalis"));
const SuperDatatable = lazy(() =>
  import("./components/datatable/SuperAdminDatatable")
);
const EmailManager = lazy(() => import("./components/email/SuperAdminEmail"));
const AdminUser = lazy(() => import("./pages/superAdmin/AdminUserPage.jsx"));
const ViewAdminDialog = lazy(() =>
  import("./pages/superAdmin/superAdminDetails.jsx")
);
const DispositionList = lazy(() => import("./pages/list/DispositionList"));
const DataList = lazy(() => import("./pages/home/DataList"));
const BlockList = lazy(() => import("./pages/list/BlockList"));
const AdminRoute = lazy(() => import("./Routes/adminRoute"));
const ManagerRoute = lazy(() => import("./Routes/ManagerRoute"));
const ITRoute = lazy(() => import("./Routes/ITRoute"));
const QualityAnalystRoute = lazy(() => import("./Routes/QualityAnalystRoute"));
const SuperAdminRoute = lazy(() => import("./Routes/SuperAdminRoute"));
const TeamL_Route = lazy(() => import("./Routes/teamL_Route"));
const AgentRoute = lazy(() => import("./Routes/agentRout"));
const LeadReportList = lazy(() => import("./pages/list/LeadReportList"));
const VerificationReportList = lazy(() => import("./pages/list/VerifyList"));
const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/login/Login"));
const Single = lazy(() => import("./pages/single/Single"));
const New = lazy(() => import("./pages/new/New"));
const SuperAddUser = lazy(() => import("./pages/new/SuperAddUser"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const EditProfile = lazy(() => import("./pages/Profile/EditPro"));
const NewCompaign = lazy(() => import("./pages/new/NewCompaign"));
const GroupList = lazy(() => import("./pages/list/GroupList"));
const CallReport = lazy(() => import("./pages/list/CallReportList"));
const MenuList = lazy(() => import("./pages/list/Menu_IVR_List"));
const NewGroup = lazy(() => import("./pages/new/NewGroup"));
const CompaignPage = lazy(() => import("./pages/Compaign/CompaignPage"));
const DataUpload = lazy(() => import("./pages/DataUploadPage/dataUpload"));
const ShowList = lazy(() => import("./pages/DataUploadPage/showList"));
const DataChurning = lazy(() => import("./pages/DataUploadPage/DialData"));
const DateFilterComponent = lazy(() =>
  import("./components/datatable/Agent_Break")
);
const LoginReport = lazy(() => import("./components/datatable/LoginReport"));
const AgentReport = lazy(() => import("./components/datatable/AgentReport"));
const ExtensionList = lazy(() =>
  import("./pages/list/Extension/ExtensionList")
);
const AssignedAgents = lazy(() =>
  import("./pages/list/Extension/AssignedAgents")
);
const FieldExecutiveList = lazy(() =>
  import("./pages/list/FieldExecutiveList")
);
const WhatsappTemplates = lazy(() =>
  import("./components/SMS/whatsappTemplate")
);
const AgentFieldExecutiveList = lazy(() =>
  import("./pages/list/AgentFieldExecutive")
);
 
const updateWrapup = async (status) => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(
      `https://${window.location.hostname}:4000/agent-wrapup`,
      { wrapup: status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    console.error("Error updating wrapup:", err);
  }
};
function App() {
  const { darkMode } = useContext(DarkModeContext);
  const [leadFormData, setLeadFormData] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationFormData, setVerificationFormData] = useState(null);

  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data?.type === "OPEN_REACT_LEAD_FORM") {
        await updateWrapup(1);  
        setLeadFormData({
          phone_number: event.data.payload.number || "",
          name: event.data.payload.name || "",
          email: event.data.payload.email || "",
          date: "",
          dialstatus: "",
          remark: "",
          reminder_datetime: "",
        });
      } else if (event.data?.type === "OPEN_VERIFICATION_FORM") {
        await updateWrapup(1);  
        setVerificationFormData({
          mobile: event.data.payload.number || "",
          name: event.data.payload.name || "",
          email: event.data.payload.email || "",
        });
        setShowVerificationModal(true);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const renderCommonRoutes = () => (
    <>
      <Route
        path="new"
        element={<New inputs={userInputs} title="Add New User" />}
      />
      <Route path="agent/:userid" element={<Single />} />
      <Route path="agent" element={<Datatable />} />
      <Route path="agentBreak" element={<DateFilterComponent />} />
      <Route path="loginReport" element={<LoginReport />} />
      <Route path="agentReport" element={<AgentReport />} />
      <Route path="campaign" element={<CompaignPage />} />
      <Route path="newCampaign" element={<NewCompaign />} />
      <Route path="sms_template" element={<CommunicationTypeSelector />} />

      <Route path="dataupload">
        <Route index element={<DataUpload />} />
        <Route path="showlist/:listId" element={<ShowList />} />
        <Route path="showlist/:listId/dialdata" element={<DataChurning />} />
      </Route>
      <Route path="menu_ivr">
        <Route index element={<MenuList />} />
      </Route>
      <Route path="ivrList">
        <Route index element={<IVRList />} />
      </Route>
      <Route path="extension">
        <Route index element={<ExtensionList />} />
        <Route path="assignedagents" element={<AssignedAgents />} />
      </Route>
      <Route path="group">
        <Route index element={<GroupList />} />
        <Route path="newGroup" element={<NewGroup />} />
      </Route>
    </>
  );

  const AllCommonRoutes = () => (
    <>
      <Route path="call_report">
        <Route index element={<CallReport />} />
      </Route>
      <Route path="verify" element={<VerificationReportList />} />
      <Route path="leadReportList">
        <Route index element={<LeadReportList />} />
      </Route>
      <Route path="blockList">
        <Route index element={<BlockList />} />
      </Route>
      <Route path="dispositionList">
        <Route index element={<DispositionList />} />
      </Route>
      <Route path="whatsapptemplate" element={<WhatsappTemplates />} />
    </>
  );

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <Router>
        <Suspense
          fallback={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: darkMode ? "#333" : "#fff",
              }}
            >
              {" "}
              <Radio />
            </div>
          }
        > 
          <LeadFormModal
            open={!!leadFormData}
            onClose={() => {
              setLeadFormData(null);
              updateWrapup(0); 
            }}
            prefill={leadFormData}
          />
          <VerificationModal
            open={showVerificationModal}
            onClose={() => {
              
              setShowVerificationModal(false);
              setVerificationFormData(null);  
               updateWrapup(0);
            }}
            prefill={verificationFormData}
          />

          {/*----------------------------------COMMON ROUTES------------------------------------------ */}
          <Routes>
            <Route path="/" element={<RedirectToCorrectRoute />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/userProfile" element={<Profile />} />

            {/*----------------------------------ADMIN ROUTES------------------------------------------ */}
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={["8"]}>
                  <AdminRoute />
                </PrivateRoute>
              }
            >
              <Route index element={<Home />} />
              <Route
                path="create-announcement"
                element={<CreateAnnouncementForm />}
              />
              <Route path="agent" element={<Datatable />} />
              <Route path="reminders" element={<ReminderTable />} />
              <Route path="data/:type" element={<DataList />} />
              <Route path="did" element={<DidList />} />
              <Route path="user-details" element={<UserDetailsTabs />} />
              <Route path="fieldexecutives" element={<FieldExecutiveList />} />
              {renderCommonRoutes()}
              {AllCommonRoutes()}
            </Route>

            {/*----------------------------------AGENT ROUTES------------------------------------------ */}

            <Route
              path="/agent"
              element={
                <PrivateRoute allowedRoles={["1"]}>
                  <AgentRoute />
                </PrivateRoute>
              }
            >
              <Route index element={<AgentHome />} />
              <Route path="edit_Profile" element={<EditProfile />} />
              <Route path="userProfile" element={<Profile />} />
              <Route path="agent/data/:type" element={<DataList />} />
              <Route path="dataupload" element={<AgentDataUpload />} />
              <Route
                path="agentfieldexecutives"
                element={<AgentFieldExecutiveList />}
              />
              {AllCommonRoutes()}
            </Route>

            {/*----------------------------------TEAM LEADER ROUTES------------------------------------------ */}
            <Route
              path="/team_leader"
              element={
                <PrivateRoute allowedRoles={["2"]}>
                  <TeamL_Route />
                </PrivateRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="edit_Profile" element={<EditProfile />} />
              <Route path="userProfile" element={<Profile />} />
              <Route
                path="new"
                element={<New inputs={userInputs} title="Add New User" />}
              />
              {renderCommonRoutes()}
              {AllCommonRoutes()}
              <Route path="data/:type" element={<DataList />} />
            </Route>

            {/*----------------------------------SUPER ADMIN ROUTES------------------------------------------ */}

            <Route
              path="/superadmin"
              element={
                <PrivateRoute allowedRoles={["9"]}>
                  <SuperAdminRoute />
                </PrivateRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="admin_control" element={<UserPermissionsEditor />} />
              <Route path="email" element={<EmailManager />} />
              <Route path="table" element={<List />} />

              <Route path="data/:type" element={<DataList />} />
              <Route path="agent" element={<SuperDatatable />} />
              <Route
                path="newUser"
                element={<SuperAddUser inputs={userInputs} title="New User" />}
              />
              <Route path="adminUser" element={<AdminUser />} />
              <Route
                path="/superadmin/details/:id"
                element={<ViewAdminDialog />}
              />

              {renderCommonRoutes()}
              {AllCommonRoutes()}
            </Route>

            {/*-------------------------------------manager ------------------------------------------ */}

            <Route
              path="/manager"
              element={
                <PrivateRoute allowedRoles={["7"]}>
                  <ManagerRoute />
                </PrivateRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="table" element={<List />} />

              <Route path="agent/:userid" element={<Single />} />
              <Route path="data/:type" element={<DataList />} />
              <Route
                path="new"
                element={<New inputs={userInputs} title="Add New User" />}
              />
              <Route path="agent" element={<Datatable />} />
              {renderCommonRoutes()}
              {AllCommonRoutes()}
            </Route>
            {/*--------------------------------------IT ROUTES------------------------------------------ */}
            <Route
              path="/it"
              element={
                <PrivateRoute allowedRoles={["5"]}>
                  <ITRoute />
                </PrivateRoute>
              }
            >
              <Route index element={<Home />} />
              {/* Add IT-specific pages here */}
            </Route>

            {/*----------------------------------QUALITY ANALYST ROUTES------------------------------------------ */}
            <Route
              path="/quality_analyst"
              element={
                <PrivateRoute allowedRoles={["6"]}>
                  <QualityAnalystRoute />
                </PrivateRoute>
              }
            >
              <Route index element={<Home />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}
function RedirectToCorrectRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser);

      if (user.user_type === "8") {
        navigate("/admin");
      } else if (user.user_type === "2") {
        navigate("/team_leader");
      } else if (user.user_type === "5") {
        navigate(`/it`);
      } else if (user.user_type === "6") {
        navigate(`/quality_analyst`);
      } else if (user.user_type === "7") {
        navigate(`/manager`);
      } else {
        navigate("/agent");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return null; // Nothing is rendered
}

export default App;
