import React, { useState, useEffect, useRef } from "react";
import socket from "./socket";
import {
  Box,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Avatar,
  TextField,
  IconButton,
  Typography,
  Paper,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Badge,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useNavigate } from "react-router-dom";
import Draggable from "react-draggable";

const CustomSpeedDial = () => {
  const [showGroupList, setShowGroupList] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState({});
  const navigate = useNavigate();
  const messageEndRef = useRef(null);
  const [groups, setGroups] = useState([]);

  // 👇 New states for creating group
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔹 Fetch messages for selected group
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (selectedGroup) {
      socket.emit("joinGroup", selectedGroup.id);

      fetch(
        `https://${window.location.hostname}:4000/api/group-chat/${selectedGroup.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((messages) => {
          const formatted = messages.map((msg) => ({
            text: msg.text || msg.message || msg.content || "",
            senderId: msg.sender_id || msg.senderId,
            senderName: msg.sender_name || msg.senderName || "Unknown",
            created_at: msg.created_at || msg.timestamp || null,
            from: (msg.sender_id || msg.senderId) === user?.user_id ? "self" : "other",
          }));

          setChatMessages((prev) => ({
            ...prev,
            [selectedGroup.id]: formatted,
          }));
        })
        .catch((err) => console.error("Fetch messages error:", err));

      socket.on("receiveMessage", (data) => {
        if (data.groupId === selectedGroup.id) {
          setChatMessages((prev) => ({
            ...prev,
            [data.groupId]: [
              ...(prev[data.groupId] || []),
              {
                ...data.message,
                senderId: data.message.senderId,
                from:
                  data.message.senderId === user?.user_id ? "self" : "other",
              },
            ],
          }));
        }
      });
    }

    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedGroup, user?.user_id]);

  // 🔹 Fetch groups for current user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user?.user_id) return;

    fetch(`https://${window.location.hostname}:4000/groupList/myGroups/${user?.user_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched groups:", data);
        if (Array.isArray(data)) {
          setGroups(data);
        } else if (Array.isArray(data?.data)) {
          setGroups(data.data);
        } else if (Array.isArray(data?.groups)) {
          setGroups(data.groups);
        } else {
          setGroups([]);
        }
      })
      .catch((err) => console.error("Error fetching groups:", err));
  }, []);

  // 🔹 Auto scroll to latest message
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, selectedGroup]);



  useEffect(() => {
    const token = localStorage.getItem("token"); // ✅ add this line

    if (selectedGroup && user?.user_id) {
      fetch(`https://${window.location.hostname}:4000/api/group-chat/seen/${selectedGroup.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.user_id }),
      })
        .catch((err) => console.error("Error marking messages as seen:", err));
    }
  }, [selectedGroup, user?.user_id]);



  // 🔹 Send message
  const handleSend = () => {
    if (newMessage.trim() && selectedGroup) {
      const newMsg = {
        text: newMessage,
        senderId: user?.user_id,
        senderName: user?.full_name,
        senderRole: user?.user_type,
        groupName: selectedGroup.name || selectedGroup.group_name,
        groupMembers: selectedGroup.members || [],
        type: "text",
        seen_by: [], // 👈 seen_by empty on send
        created_at: new Date().toISOString(), // 👈 time
      };

      socket.emit("sendMessage", {
        groupId: selectedGroup.id,
        message: newMsg,
      });

      setChatMessages((prev) => ({
        ...prev,
        [selectedGroup.id]: [...(prev[selectedGroup.id] || []), newMsg],
      }));

      setNewMessage("");
    }
  };


  // 🔹 Create Group Function
  const handleCreateGroup = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!newGroupName.trim() || !groupMembers.trim()) {
      alert("Please enter group name and members!");
      return;
    }

    const membersArray = groupMembers.split(",").map((id) => id.trim());

    fetch(`https://${window.location.hostname}:4000/groupList/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        group_name: newGroupName,
        created_by: user?.user_id,
        members: membersArray,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("✅ Group created successfully!");
          setShowCreateGroup(false);
          setNewGroupName("");
          setGroupMembers("");

          fetch(
            `https://${window.location.hostname}:4000/groupList/myGroups/${user?.user_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
            .then((res) => res.json())
            .then((data) => setGroups(data));
        } else {
          alert("❌ Failed to create group!");
        }
      })
      .catch((err) => console.error("Error creating group:", err));
  };

  const actions = [
    {
      icon: <ChatIcon />,
      name: "Group Chat",
      action: () => setShowGroupList(true),
    },
    {
      icon: <WhatsAppIcon />,
      name: "WhatsApp",
      action: () => navigate("/admin/whatsapptemplate"),
    },
    {
      icon: <VideoCallIcon />,
      name: "Video Call",
      action: () => window.open("https://meet.next2call.com/", "_blank"),
    },
    {
      icon: <EmailIcon />,
      name: "Email",
      action: () => (window.location.href = "mailto:someone@example.com"),
    },
  ];

  return (
    <>
      {/* Main Chat Window */}
      {showGroupList && (
        <Box
          sx={{
            position: "fixed",
            bottom: 40,
            right: 40,
            width: 700,
            height: 520,
            bgcolor: "#fff",
            borderRadius: 3,
            boxShadow: "0 6px 25px rgba(0,0,0,0.2)",
            zIndex: 1300,
            display: "flex",
            flexDirection: "row",
            overflow: "hidden",
          }}
        >
          {/* Left Sidebar - Groups List */}
          <Box
            sx={{
              width: "35%",
              borderRight: "1px solid #e0e0e0",
              display: "flex",
              flexDirection: "column",
              bgcolor: "#fafafa",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                bgcolor: "#1976d2",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.5,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Groups
              </Typography>

              {/* Create Group Icon */}
              {user?.user_type == 8 && (
                <IconButton
                  sx={{ color: "#fff" }}
                  onClick={() => setShowCreateGroup(true)}
                >
                  <AddIcon />
                </IconButton>
              )}
            </Box>

            {/* Group List */}
            <Box sx={{ flex: 1, overflowY: "auto" }}>
              {Array.isArray(groups) && groups.length > 0 ? (
                groups.map((group) => (
                  <ListItem
                    key={group.id || group.group_id}
                    button
                    onClick={() => setSelectedGroup(group)}
                    sx={{
                      px: 2,
                      py: 1.2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#f0f4ff" },
                      bgcolor:
                        selectedGroup?.id === group.id ? "#e3f2fd" : "transparent",
                    }}
                  >
                    <Avatar sx={{ bgcolor: "#1976d2", fontWeight: 600 }}>
                      {(group.name || group.group_name || "G").charAt(0)}
                    </Avatar>
                    <ListItemText
                      primary={group.name || group.group_name || "Unnamed"}
                      primaryTypographyProps={{
                        fontWeight: 600,
                        fontSize: "0.95rem",
                      }}
                      secondaryTypographyProps={{
                        color: "#777",
                        fontSize: "0.8rem",
                      }}
                    />
                    {group.unread > 0 && (
                      <Badge badgeContent={group.unread} color="error" />
                    )}
                  </ListItem>
                ))
              ) : (
                <Typography sx={{ textAlign: "center", p: 2, color: "#777" }}>
                  No groups found.
                </Typography>
              )}
            </Box>
          </Box>

          {/* Right Side - Chat Window */}
          <Box
            sx={{
              width: "65%",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* Header */}
            {selectedGroup ? (
              <Box
                sx={{
                  bgcolor: "#1976d2",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.5,
                }}
              >
                <Avatar sx={{ bgcolor: "#fff", color: "#1976d2", fontWeight: 600 }}>
                  {(selectedGroup.name || selectedGroup.group_name || "G").charAt(0)}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {selectedGroup.name || selectedGroup.group_name || "Unnamed"}
                </Typography>
                <Box sx={{ ml: "auto" }}>
                  <IconButton
                    sx={{ color: "#fff" }}
                    onClick={() => setSelectedGroup(null)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  bgcolor: "#1976d2",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.5,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Select a Group to Chat
                </Typography>

                {/* 🔹 Close Button to hide group chat */}
                <IconButton
                  sx={{ color: "#fff" }}
                  onClick={() => {
                    setShowGroupList(false);
                    setSelectedGroup(null);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

            )}

            {/* Chat Messages */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 2,
                bgcolor: "#f5f6fa",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {selectedGroup &&
                Array.isArray(chatMessages[selectedGroup.id]) &&
                chatMessages[selectedGroup.id].length > 0 ? (
                chatMessages[selectedGroup.id].map((msg, index) => {
                  const isSelf = msg.senderId === user?.user_id;
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: isSelf ? "flex-end" : "flex-start",
                        mb: 1.5,
                      }}
                    >
                      <Paper
                        sx={{
                          p: 1.2,
                          borderRadius: 2,
                          maxWidth: "70%",
                          bgcolor: isSelf ? "#d1f7c4" : "#fff",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        }}
                      >
                        {!isSelf && (
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              color: "#1976d2",
                              mb: 0.3,
                            }}
                          >
                            {msg.senderName || msg.sender_name || "User"}
                          </Typography>
                        )}

                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                        >
                          {msg.text || msg.message || msg.content || "[Empty message]"}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            mt: 0.3,
                            gap: 0.5,
                          }}
                        >
                          <Typography variant="caption" sx={{ color: "#999" }}>
                            {msg.created_at
                              ? new Date(msg.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                              : ""}
                          </Typography>
                          {isSelf &&
                            (msg.seen ? (
                              <DoneAllIcon sx={{ fontSize: 14, color: "#1976d2" }} />
                            ) : (
                              <DoneIcon sx={{ fontSize: 14, color: "#999" }} />
                            ))}
                        </Box>
                      </Paper>
                    </Box>
                  );
                })
              ) : (
                selectedGroup && (
                  <Typography sx={{ textAlign: "center", color: "#777", mt: 2 }}>
                    No messages yet.
                  </Typography>
                )
              )}
              <div ref={messageEndRef} />
            </Box>

            {/* Input Field */}
            {selectedGroup && (
              <Box
                sx={{
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  borderTop: "1px solid #ddd",
                  bgcolor: "#fff",
                }}
              >
                <IconButton>
                  <EmojiEmotionsIcon />
                </IconButton>
                <IconButton>
                  <AttachFileIcon />
                </IconButton>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <IconButton onClick={handleSend} color="primary">
                  <SendIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Floating Button */}
      <Draggable>
        <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1301 }}>
          <SpeedDial
            ariaLabel="Chat Menu"
            icon={<SpeedDialIcon />}
            open={speedDialOpen}
            onClick={() => setSpeedDialOpen(!speedDialOpen)}
            direction="up"
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() => {
                  setSpeedDialOpen(false);
                  action.action();
                }}
              />
            ))}
          </SpeedDial>
        </Box>
      </Draggable>

      {/* Create Group Popup */}
      {showCreateGroup && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 360,
            bgcolor: "#fff",
            borderRadius: 3,
            boxShadow: "0 6px 25px rgba(0,0,0,0.2)",
            zIndex: 1500,
            p: 2.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
              bgcolor: "#1976d2",
              color: "#fff",
              px: 1.5,
              py: 1,
              borderRadius: 1,
            }}
          >
            <IconButton
              size="small"
              sx={{ color: "#fff" }}
              onClick={() => setShowCreateGroup(false)}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Create Group
            </Typography>
          </Box>

          <TextField
            label="Group Name"
            fullWidth
            size="small"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Members (Comma separated IDs)"
            fullWidth
            size="small"
            value={groupMembers}
            onChange={(e) => setGroupMembers(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#1976d2",
              "&:hover": { bgcolor: "#1259a8" },
              borderRadius: 2,
              textTransform: "none",
            }}
            onClick={handleCreateGroup}
          >
            Create
          </Button>
        </Box>
      )}
    </>
  );

};

export default CustomSpeedDial;
