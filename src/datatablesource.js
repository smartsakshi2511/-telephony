export const userColumns = [
  { field: "id", headerName: "ID", width: 50 },
  { field: "priority", headerName: "Prioprity", width: 70 },
  {
    field: "user",
    headerName: "UserID",
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
  { field: "password", headerName: "Password", width: 100 },
  {
    field: "Phone number",
    headerName: "Phone Number",
    width: 120,
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
    headerName: "Extn Number",
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
    headerName: "Status",
    width: 50,
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
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    status: "active",
    Extn: "1snow@gmail.com",
   clidid: 35,
    num:1344443332,
    numIcon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrTCJJkw2mHkYNstUdr3ai-vPSU5CjtI39cg&s"

  },
  {
    id: 2,
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
    username: "Roxie",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    Extn: "snow@gmail.com",
    status: "pending",
   clidid: 65,
    num:133332
  },
  {
    id: 10,
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
    username: "Snow",
     
    status: "active",
    Extn: "1snow@gmail.com",
   clidid: 35,
    num:1344443332,
    numIcon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrTCJJkw2mHkYNstUdr3ai-vPSU5CjtI39cg&s"

  },
  {
    id: 2,
    username: "Jamie Lannister",
   
    Extn: "2snow@gmail.com",
    status: "deactive",
   clidid: 42,
    num:133332,
    numIcon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrTCJJkw2mHkYNstUdr3ai-vPSU5CjtI39cg&s"

  },
  {
    id: 3,
    username: "Lannister",
    
    Extn: "3snow@gmail.com",
    status: "deactive",
   clidid: 45,
    num:133332,
    numIcon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrTCJJkw2mHkYNstUdr3ai-vPSU5CjtI39cg&s"

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

