import React, { useState } from "react";
import {
  Container,
  Grid,
  TextField,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Snackbar,
  Fade,
  Grow,
  Paper,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { styled } from "@mui/system";
import axios from "axios";

const GradientTabs = styled(Tabs)(() => ({
  // background: "linear-gradient(to right, #2196f3, #21cbf3)",
  borderRadius: 12,
  padding: "4px 8px",
  ".MuiTab-root": {
    // color: "white",
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

const whatsappTemplates = [
{
  name: "CRM Access Info",
  description: "Notify users their CRM access is active with key features.",
  template: `Your access to our Cloud Telephony CRM system is active

Key features available:
• Call tracking and analytics  
• IVR menu routing  
• Agent performance dashboards  
• Call Detail Reports (CDR)

For access instructions or assistance,  
visit {{crmLink}}

Thanks, Team Winet`,
  variables: ["crmLink"],
  apiName: "ringfyinformation"  
}
,
  {
    name: "Live Support Info",
    description: "Send WhatsApp live support contact.",
    template: `Hi {{userName}},

For live support, contact us at:

📱 WhatsApp: {{supportNumber}}
🌐 Website: {{website}}

We're here to help! — Team {{companyName}}`,
    variables: ["userName", "supportNumber", "website", "companyName"],
    apiName: "livesupport",
  },
];

const WhatsAppTemplates = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({});
  const [phoneNumber, setPhoneNumber] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
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
      whatsappTemplates[activeTab].template,
      formData[activeTab] || {}
    );
    navigator.clipboard.writeText(msg).then(() => setCopySuccess(true));
  };

  const handleSend = async () => {
    const currentData = formData[activeTab] || {};
    const phone = phoneNumber.trim();

    if (!phone || !/^\d{10,15}$/.test(phone)) {
      return setSnackbarMessage("Please enter a valid phone number.");
    }

    const paramList = whatsappTemplates[activeTab].variables.map(
      (key) => currentData[key] || ""
    );

    console.log("Sending params:", paramList);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return setSnackbarMessage("Authentication token not found.");
      }

      await axios.post(
        `https://${window.location.hostname}:4000/send-whatsapp`,
        {
          to: phone,
          templateName: whatsappTemplates[activeTab].apiName,
          parameters: paramList,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSnackbarMessage("Message sent successfully!");
    } catch (err) {
      console.error("Send Error:", err);
      const errorMsg =
        err.response?.data?.error ||
        (err.code === "ERR_BAD_RESPONSE"
          ? "Server error – please try again later."
          : err.message);
      setSnackbarMessage(`Failed to send message: ${errorMsg}`);
    }
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
        WhatsApp Templates
      </Typography>
      <GradientTabs
        value={activeTab}
        onChange={(e, newVal) => setActiveTab(newVal)}
        sx={{ mb: 2 }}
        centered
      >
        {whatsappTemplates.map((tpl, i) => (
          <Tab key={i} label={tpl.name} />
        ))}
      </GradientTabs>

      <Typography variant="body2" color="text.secondary" mb={3}>
        {whatsappTemplates[activeTab].description}
      </Typography>

      <Grid container spacing={4}>
        <Grow in={true} timeout={600}>
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
              <Typography
                variant="h6"
                mb={2}
                fontWeight={600}
                color="primary.dark"
              >
                Fill Template Variables
              </Typography>

              <TextField
                label="Recipient Phone Number"
                fullWidth
                variant="outlined"
                margin="dense"
                sx={{ mb: 2 }}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., 919876543210"
              />

              {whatsappTemplates[activeTab].variables.map((v) => (
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
                variant="contained"
                size="large"
                color="success"
                fullWidth
                sx={{ mt: 2, borderRadius: 3 }}
                onClick={handleSend}
              >
                Send via WhatsApp
              </Button>
            </Box>
          </Grid>
        </Grow>

        <Grow in={true} timeout={700}>
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  WhatsApp Preview
                </Typography>
                <Tooltip title="Copy to Clipboard">
                  <IconButton onClick={handleCopy} color="primary">
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Fade in={true}>
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
                    whatsappTemplates[activeTab].template,
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

export default WhatsAppTemplates;
