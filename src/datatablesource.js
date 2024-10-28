export const userColumns = [
  { field: "id", headerName: "ID", width: 50 },
  { field: "priority", headerName: "PRIOPRITY", width: 100 },
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
  { field: "password", headerName: "PASSWORD", width: 100 },
  {
    field: "Phonenumber",
    headerName: "PHONE NUMBERr",
    width: 150,
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
    width: 150, 
  },

  {
    field: "clidid",
    headerName: "CLI/DID",
    width: 120,
    required : true
  },
  {
    field: "status",
    headerName: "STATUS",
    width: 100,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];

//temporary data
export const userRows = [
  {
    id: 1,
    username: "Snow",
    priority:"1",
    user:"8080",
    password:"hdj464",
    Phonenumber:"0123654789",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    status: "active",
    Extn: "1snow@gmail.com",
   clidid: 35,
    num:1344443332,
    numIcon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrTCJJkw2mHkYNstUdr3ai-vPSU5CjtI39cg&s"

  },
  {
    id: 2,
    priority:"2",
    user:"8081",
    password:"hdyj464",
    Phonenumber:"0856374789",
    username: "Jamie Lannister",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    Extn: "2snow@gmail.com",
    status: "deactive",
   clidid: 42,
    num:133332,
    numIcon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrTCJJkw2mHkYNstUdr3ai-vPSU5CjtI39cg&s"

  },
  {
    id: 3,
    priority:"3",
    user:"8082",
    password:"847yfy",
    Phonenumber:"8974654789",
    username: "Lannister",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    Extn: "3snow@gmail.com",
    status: "deactive",
   clidid: 45,
    num:133332,
    numIcon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrTCJJkw2mHkYNstUdr3ai-vPSU5CjtI39cg&s"

  },
  {
    id: 4,
    priority:"4",
    user:"8083",
    password:"hdjduejfnvi",
    Phonenumber:"3473654789",
    username: "Stark",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    Extn: "4snow@gmail.com",
    status: "active",
   clidid: 16,
    num:133332,
    numIcon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrTCJJkw2mHkYNstUdr3ai-vPSU5CjtI39cg&s"

  },
  {
    id: 5,
    priority:"5",
    user:"8084",
    password:"464fdhbdh",
    Phonenumber:"987456789",
    username: "Targaryen",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    Extn: "5snow@gmail.com",
    status: "passive",
   clidid: 22,
    num:133332,
    numIcon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrTCJJkw2mHkYNstUdr3ai-vPSU5CjtI39cg&s"

    
  },
  {
    id: 6,
    priority:"6",
    user:"8085",
    password:"37439egd",
    Phonenumber:"943854789",
    username: "Melisandre",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    Extn: "6snow@gmail.com",
    status: "active",
   clidid: 15,
    num:133332,
    numIcon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrTCJJkw2mHkYNstUdr3ai-vPSU5CjtI39cg&s"

  },
  {
    id: 7,
    priority:"7",
    user:"8086",
    password:"hdj46jr",
    Phonenumber:"89840054789",
    username: "Clifford",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    Extn: "7snow@gmail.com",
    status: "passive",
   clidid: 44,
    num:133332,
    numIcon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrTCJJkw2mHkYNstUdr3ai-vPSU5CjtI39cg&s"

  },
  {
    id: 8,
    priority:"8",
    user:"8087",
    password:"eiryew",
    Phonenumber:" 9827224789",
    username: "Frances",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    Extn: "8snow@gmail.com",
    status: "active",
   clidid: 36,
    num:133332,
    numIcon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrTCJJkw2mHkYNstUdr3ai-vPSU5CjtI39cg&s"

  },
  {
    id: 9,
    priority:"9",
    user:"8088",
    password:"jghfjir",
    Phonenumber:"ijg5654789",
    username: "Roxie",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    Extn: "snow@gmail.com",
    status: "pending",
   clidid: 65,
    num:133332
  },
  {
    id: 10,
    priority:"10",
    user:"8089",
    password:"hdjkrtnjrtk",
    Phonenumber:"0989380578",
    username: "Roxie",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    Extn: "snow@gmail.com",
    status: "active",
   clidid: 65,
    num:133332,
    numIcon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrTCJJkw2mHkYNstUdr3ai-vPSU5CjtI39cg&s"

  },
];

export const CompaignColumn =[
  { field: "com_id", headerName: " COMP ID", width: 50 },
  {
    field: "userName",
    headerName: "NAME",
    width: 100,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {params.row.username}
        </div>
      );
    },
  },
  { field: "inbound_cid", headerName: "INBOUND CID.", width: 100 },
  { field: "outbound_cid", headerName: "OUTBOUND CID.", width: 100 },
  { field: "calltime", headerName: "CALL TIME", width: 100 },
  { field: "weekoff", headerName: "WEEK OFF", width: 100 },
  { field: "after_ivr", headerName: "AFTER IVR PARK MUSIC", width: 200 },
  { field: "no_agent", headerName: "NO AGENT IVR MUSIC", width: 100 },


];

export const compaignRows = [
  {
    id: 1,
    com_id: 1,
    inbound_cid: 8004030958,
    outbound_cid: 8004030958,
    calltime: "12am-11pm",
    weekoff: "Sunday",
    after_ivr:  "record",
    no_agent: "Empty",
    username: "Snow",     
    status: "active",
  
  },
  {
    id: 2,
    username: "Jamie Lannister",
    status: "deactive",
    com_id: 2,
    inbound_cid: 9889030958,
    outbound_cid: 9874563210,
    calltime: "2am-4pm",
    weekoff: "Monday",
    after_ivr:  "record",
    no_agent: "Empty",
  },
  {
    id: 3,
    username: "Lannister",  
    status: "deactive",
    com_id: 3,
    inbound_cid: 8469730958,
    outbound_cid: 6359863210,
    calltime: "6pm-8pm",
    weekoff: "Friday",
    after_ivr:  "record",
    no_agent: "Empty",

  },
];
// src/datatablesource/userGroupData.js

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
  // Add more rows as needed
];

