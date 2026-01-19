import { useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Paper,
  Divider,
  useTheme,
  Typography,
  Fade,
} from "@mui/material";
import DateFilterComponent from "../datatable/Agent_Break"; // Adjust path as needed
import AgentReport from "../datatable/AgentReport"; // Adjust path as needed
import LoginReport from "../datatable/LoginReport"; // Adjust path as needed

const UserDetailsTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();

  const handleTabChange = (_, newTab) => {
    setActiveTab(newTab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <DateFilterComponent />;
      case 1:
        return <AgentReport />;
      case 2:
        return <LoginReport />;
      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        width: "100%",
        mt: 3,
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
        backgroundColor: theme.palette.background.paper,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: theme.palette.primary.main,
          mb: 2,
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        User Activity Reports
      </Typography>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        // variant="scrollable"
        scrollButtons="auto"
        aria-label="User activity tabs"
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.95rem",
            px: 2,
          },
          "& .Mui-selected": {
            color: theme.palette.primary.main,
          },
        }}
      >
        <Tab label="Agent Breaks" />
        <Tab label="Agent Report" />
        <Tab label="Login Report" />
      </Tabs>

      <Divider sx={{ my: 2 }} />

      <Fade in timeout={400}>
        <Box sx={{ mt: 1 }}>{renderTabContent()}</Box>
      </Fade>
    </Paper>
  );
};

export default UserDetailsTabs;
