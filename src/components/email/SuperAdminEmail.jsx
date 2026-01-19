import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Divider,
} from "@mui/material";
import OutgoingMails from "./OutgoingMails";
import IncomingMails from "./IncomingMails";
import SendIcon from "@mui/icons-material/Send";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";

const EmailManager = () => {
  const [tab, setTab] = useState("sent");

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box mb={2}>
        <Typography variant="h5" fontWeight="bold">
          📧 Email Management
        </Typography>
        <Divider sx={{ mt: 1 }} />
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(e, newTab) => setTab(newTab)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{
          mb: 3,
        }}
      >
        <Tab
          icon={<SendIcon />}
          iconPosition="start"
          label="Sent Emails"
          value="sent"
        />
        <Tab
          icon={<InboxIcon />}
          iconPosition="start"
          label="Inbox"
          value="inbox"
        />
        <Tab
          icon={<DraftsIcon />}
          iconPosition="start"
          label="Drafts"
          value="drafts"
        />
      </Tabs>

      {/* Tab Content */}
      <Box>
        {tab === "sent" && <OutgoingMails />}
        {tab === "inbox" && <IncomingMails />}
        {tab === "drafts" && (
          <Typography color="text.secondary" p={2}>
            ✍️ Draft feature coming soon...
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default EmailManager;
