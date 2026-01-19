import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Typography,
  Grid,
  Paper,
  Container,
  Fade,
  Grow,
  IconButton,
  Tooltip,
  Snackbar,
  Button,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import SendIcon from "@mui/icons-material/Send";
import { styled } from "@mui/system";

const messageTemplates = [
  {
    name: "Welcome Message",
    description: "A warm welcome message for new users.",
    template: `Welcome to {{companyName}} - The Ultimate Cloud Telephony CRM Software.\n\nExperience seamless communication combined with powerful customer relationship management.\n\nRead more at {{website}}.\n\nTeam {{companyName}}`,
    variables: ["companyName", "website"],
  },
  {
    name: "Dashboard Introduction",
    description: "Introduce users to the dashboard features.",
    template: `Hi {{userName}},\n\nOur Cloud Telephony CRM software offers a dynamic dashboard with key metrics, KPIs, and live call tracking for faster decision-making.\n\nEnjoy seamless agent management, live attendance, IVR customization, and more—all from a unified interface.\n\nLearn more: {{dashboardLink}}\n\nTeam {{companyName}}`,
    variables: ["userName", "dashboardLink", "companyName"],
  },
  {
    name: "CRM Feature Summary",
    description: "Summarize CRM features and book a demo.",
    template: `Hi {{name}},\n\nUnlock the full potential of {{companyName}} CRM. Here's a quick overview:\n\n• Dashboard with live metrics\n• Agent login/logout & break control\n• Click-to-call, call reports & CDRs\n• Real-time call status\n• CRM, IVR, campaign control — all in one\n\nBook a demo: {{demoLink}}\n\nTeam {{companyName}}`,
    variables: ["name", "companyName", "demoLink"],
  },
];

const GradientTabs = styled(Tabs)(() => ({
  borderRadius: 12,
  padding: "4px 8px",
  ".MuiTab-root": {
    fontWeight: 600,
    borderRadius: 8,
    textTransform: "none",
  },
  ".Mui-selected": {
    background: "rgba(255,255,255,0.15)",
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "#f8f9fa",
  padding: theme.spacing(3),
  borderRadius: 20,
  minHeight: 300,
  border: "1px solid #e0e0e0",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
}));

const MessageTemplates = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({});
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (e, index) => {
    setFormData({
      ...formData,
      [index]: {
        ...formData[index],
        [e.target.name]: e.target.value,
      },
    });
  };

  const renderMessage = (templateStr, data) => {
    let msg = templateStr;
    for (const key in data) {
      const regex = new RegExp(`{{${key}}}`, "g");
      msg = msg.replace(regex, data[key] || "");
    }
    return msg;
  };

  const handleCopy = () => {
    const msg = renderMessage(
      messageTemplates[activeTab].template,
      formData[activeTab] || {}
    );
    navigator.clipboard.writeText(msg).then(() =>
      setSnackbarMessage("Copied to clipboard!")
    );
  };

  const handleDownload = () => {
    const msg = renderMessage(
      messageTemplates[activeTab].template,
      formData[activeTab] || {}
    );
    const blob = new Blob([msg], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${messageTemplates[activeTab].name}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSend = () => {
    const msg = renderMessage(
      messageTemplates[activeTab].template,
      formData[activeTab] || {}
    );
    console.log("Sending message:\n", msg);
    setSnackbarMessage("Message sent successfully!");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 800,
          background: "linear-gradient(to right, #1976d2, #00c6ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "1px 1px 1px rgba(0,0,0,0.1)",
        }}
      >
        Message Templates
      </Typography>

      <GradientTabs
        value={activeTab}
        onChange={(e, newVal) => setActiveTab(newVal)}
        sx={{ mb: 2 }}
        centered
      >
        {messageTemplates.map((tpl, i) => (
          <Tab key={i} label={tpl.name} />
        ))}
      </GradientTabs>

      <Typography variant="body2" color="text.secondary" mb={3}>
        {messageTemplates[activeTab].description}
      </Typography>

      <Grid container spacing={4}>
        <Grow in timeout={600}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 4,
                bgcolor: "#ffffff",
                borderRadius: 6,
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="h6" mb={2} fontWeight={600} color="primary.dark">
                Fill Template Variables
              </Typography>

              {messageTemplates[activeTab].variables.map((v) => (
                <TextField
                  key={v}
                  label={v}
                  name={v}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  sx={{ mb: 2 }}
                  value={formData[activeTab]?.[v] || ""}
                  onChange={(e) => handleChange(e, activeTab)}
                />
              ))}

              <Button
                onClick={handleSend}
                variant="contained"
                color="success"
                fullWidth
                sx={{ mt: 2 }}
              >
                Send Message
              </Button>
            </Box>
          </Grid>
        </Grow>

        <Grow in timeout={700}>
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  Message Preview
                </Typography>

                <Box display="flex" gap={1}>
                  <Tooltip title="Copy">
                    <IconButton onClick={handleCopy} color="primary">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download">
                    <IconButton onClick={handleDownload} color="primary">
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Send">
                    <IconButton onClick={handleSend} color="success">
                      <SendIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Fade in>
                <Typography
                  sx={{
                    whiteSpace: "pre-line",
                    fontFamily: "monospace",
                    fontSize: 15,
                    color: "#333",
                    mt: 2,
                    p: 2,
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    border: "1px dashed #ccc",
                  }}
                >
                  {renderMessage(
                    messageTemplates[activeTab].template,
                    formData[activeTab] || {}
                  )}
                </Typography>
              </Fade>
            </StyledPaper>
          </Grid>
        </Grow>
      </Grid>

      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={3000}
        onClose={() => setSnackbarMessage("")}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default MessageTemplates;
