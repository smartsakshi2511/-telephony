 import AudioPlayer from "./pages/Compaign/AudioPlayer";

export const userColumns = [ 
  { field: "priority", headerName: "PRIOPRITY", width: 100},
  {
    field: "user",
    headerName: "USER ID",
    width: 100,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img} alt="avatar" />
          {params.row.username}
        </div>
      );
    },
  },
  { field: "password", headerName: "PASSWORD", width: 100},
  {
    field: "Phonenumber",
    headerName: "PHONE NUMBERr",
    width: 150, headerClassName: "customHeader",
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
           {params.row.num}
          <img className="cellImg" src={params.row.numIcon} alt="avatar" />
         
        </div>
      );
    },
  },
  {
    field: "Extn",
    headerName: "EXTN NUMBER",
    width: 150
  },

  {
    field: "clidid",
    headerName: "CLI/DID",
    width: 120,
    headerClassName: "customHeader",
    required : true
  },
  {
    field: "status",
    headerName: "STATUS",
    width: 100,
    // headerClassName: "customHeader",
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];

const backendBaseUrl = `https://${window.location.hostname}:4000/`;

export const CompaignColumn = [
  { field: "compaign_id", headerName: "COMP ID", width: 80  },
  { 
    field: "compaignname", 
    headerName: "NAME", 
    width:100, 
    renderCell: (params) => <div className="cellWithImg">{params.row.compaignname}</div>,
  },
  { field: "status", headerName: "STATUS", width: 60   },
  { field: "campaign_number", headerName: "INBOUND CID.", width:150  },
  { field: "outbond_cli", headerName: "OUTBOUND CID.",width: 150  },
  { field: "local_call_time", headerName: "CALL TIME", width:100  },

  { field: "week_off", headerName: "WEEK OFF", width:100  },

  // {
  //   field: "welcome_ivr",
  //   headerName: "WELCOME IVR",
  //   width: 60,
  //   headerClassName: "customHeader",
  //   renderCell: (params) => {
  //     let audioUrl = params.row.welcome_ivr ? params.row.welcome_ivr : '';
  //     if (audioUrl && !audioUrl.startsWith('http')) {
  //       audioUrl = `${backendBaseUrl}${audioUrl}`;
  //     }
  //     return <AudioPlayer audioUrl={audioUrl} />;
  //   },
  // },
  // {
  //   field: "after_office_ivr",
  //   headerName: "AFTER IVR",
  //   width: 80,
  //   renderCell: (params) => {
  //     let audioUrl = params.row.after_office_ivr ? params.row.after_office_ivr : '';
  //     if (audioUrl && !audioUrl.startsWith('http')) {
  //       audioUrl = `${backendBaseUrl}${audioUrl}`;
  //     }
  //     return <AudioPlayer audioUrl={audioUrl} />;
  //   },
  // },
  // {
  //   field: "ivr",
  //   headerName: "PARK MUSIC",
  //   width: 80,
  //   renderCell: (params) => {
  //     let audioUrl = params.row.ivr ? params.row.ivr : '';
  //     if (audioUrl && !audioUrl.startsWith('http')) {
  //       audioUrl = `${backendBaseUrl}${audioUrl}`;
  //     }
  //     return <AudioPlayer audioUrl={audioUrl} />;
  //   },
  // },
  // {
  //   field: "no_agent_ivr",
  //   headerName: "NO AGENT",
  //   width: 80,
  //   renderCell: (params) => {
  //     let audioUrl = params.row.no_agent_ivr ? params.row.no_agent_ivr : '';
  //     if (audioUrl && !audioUrl.startsWith('http')) {
  //       audioUrl = `${backendBaseUrl}${audioUrl}`;
  //     }
  //     return <AudioPlayer audioUrl={audioUrl} />;
  //   },
  // },
  // {
  //   field: "ring_tone_music",
  //   headerName: "RINGTONE",
  //   flex: 1,
  //   renderCell: (params) => {
  //     let audioUrl = params.row.ring_tone_music ? params.row.ring_tone_music : '';
  //     if (audioUrl && !audioUrl.startsWith('http')) {
  //       audioUrl = `${backendBaseUrl}${audioUrl}`;
  //     }
  //     return <AudioPlayer audioUrl={audioUrl} />;
  //   },
  // },
];

 

export const userGroupColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "userGroup",
    headerName: "USER GROUP",
    width: 150,
    editable: false,
  },
  {
    field: "groupName",
    headerName: "GROUP NAME",
    width: 200,
    editable: false,
  },
  {
    field: "pressKey",
    headerName: "PRESS KEY",
    width: 150,
    editable: false,
  },
  {
    field: "campaign",
    headerName: "CAMPAIGN",
    width: 200,
    editable: false,
  },
  // Action column will be added dynamically in the component
];

export const userGroupRows = [
  {
    id: 1,
    userGroup: "Admin",
    groupName: "Administrators",
    pressKey: "A1",
    campaign: "Campaign A",
  },
  {
    id: 2,
    userGroup: "User",
    groupName: "Regular Users",
    pressKey: "U1",
    campaign: "Campaign B",
  },
 
];


export const dataUploadColumns = (navigate, handleToggleStatus, handleEdit, handleDelete) => [
  {
    field: "ID",
    headerName: "ID",
    flex: 0.5,
    renderCell: (params) => (
      <button
        className="listIdButton"
        onClick={() => navigate(`/showlist/${params.value}`)}
        style={{
          background: "none",
          border: "none",
          color: "blue",
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >
        {params.value}
      </button>
    ),
  },
  { field: "LIST_ID", headerName: "LIST ID", flex: 1   },
  { field: "NAME", headerName: "NAME", flex: 1},
  { field: "DESCRIPTION", headerName: "DESCRIPTION", flex: 1},
  { field: "CAMPAIGN", headerName: "CAMPAIGN", flex: 1},
  {
    field: "ACTIVE",
    headerName: "Status",
    width: 180,
    renderCell: (params) => {
      const isActive = params.row.ACTIVE === "active";
      return (
        <button
          className={`statusButton ${isActive ? "active" : "inactive"}`}
          onClick={() => handleToggleStatus(params.row.ID)}
        >
          {isActive ? "Active" : "Inactive"}
        </button>
      );
    },
  },
  {
    field: "RTIME",
    headerName: "CREATE TIME",
    flex: 1.5,
  },
  {
    field: "action",
    headerName: "ACTION",
    flex: 1,
    renderCell: (params) => (
      <div className="cellAction" style={{ display: "flex", gap: "8px" }}>
        <button onClick={() => handleEdit(params.row)}>Edit</button>
        <button onClick={() => handleDelete(params.row)}>Delete</button>
      </div>
    ),
  },
];

export const userInputs = [
  {
    id: 1,
    label: "User ID",
    type: "number",
    placeholder: "john_doe",
    required: true
  },
  {
    id: 2,
    label: "Name and surname",
    type: "text",
    placeholder: "John Doe",
  },
  {
    id: 3,
    label: "Compaign Name",
    type: "mail",
    placeholder: "Admin",
  },
  {
    id: 4,
    label: "Phone",
    type: "number",
    placeholder: "+1 234 567 89",
  },
  {
    id: 5,
    label: "Password",
    type: "password",
  },
  {
    id: 6,
    label: "Selected User",
    type: "text",
    placeholder: "Agent",
  },
  {
    id: 7,
    label: "External Number",
    type: "number",
    placeholder: "+12 1111 111111",
  },
  {
    id: 8,
    label: "Use DID",
    type: "number",
    placeholder: "+12 1111 111111",
  },
]
