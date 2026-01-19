import React, { useContext, useState, useEffect ,lazy, Suspense} from "react";
import Box from "@mui/material/Box";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import { toast } from 'react-toastify';
import bgimg from "./bg/backimg.jpg";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { AuthContext } from "../../context/authContext";
import { Refresh } from "@mui/icons-material";  
import IconButton from "@mui/material/IconButton";
const Player = lazy(() =>
  import('@lottiefiles/react-lottie-player').then(module => ({ default: module.Player }))
);


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function Login() {
  const { login } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [password, setPassword] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [showCampaignDropdown, setShowCampaignDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [otpExpired, setOtpExpired] = useState(false);
  useEffect(() => {
    let timer;
    if (showOtp && countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    if (showOtp && countdown === 0) {
      setResendDisabled(false);
      setOtpExpired(true);  
    }
    return () => clearTimeout(timer);
  }, [countdown, showOtp]);


  const navigateByUserType = (user_type) => {
    const routes = {
      1: "/agent",
      2: "/team_leader",
      5: "/it",
      6: "/quality_analyst",
      7: "/manager",
      8: "/admin",
      9: "/superadmin",
    };
    navigate(routes[user_type] || "/agent");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    console.log("   Token:", storedToken);

    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser);
      if (user.user_type === "1" || user.user_type === "2") return;
      navigateByUserType(user.user_type);
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userId || !password) {
      setOpen(true);
      return;
    }

    try {
      setLoading(true);
      const response = await Axios.post(
        `https://${window.location.hostname}:4000/log/login`,
        {
          user_id: userId,
          password,
        }
      );

      if (response.data.otpRequired) {
        setShowOtp(true);
        setCountdown(60); 
        setOtpExpired(false);    
        setResendDisabled(true);
        return;
      }
      if (response.data.token && response.data.user) {
        const { token, user, campaigns } = response.data;


        console.log("🔑 Raw JWT Token:", token);
        const permissionRes = await Axios.get(
          `https://${window.location.hostname}:4000/permissions/${user.user_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const permissions = permissionRes.data;

        setIsLoggedIn(true);
        setUserType(user.user_type);

        if (user.user_type === "1" || user.user_type === "2") {

          setShowCampaignDropdown(true);
          setCampaigns(campaigns || []);
          localStorage.setItem("tempUser", JSON.stringify(user));
          localStorage.setItem("tempToken", token);
          localStorage.setItem("tempPermissions", JSON.stringify(permissions));
        } else {
          login(user, token, permissions);
          navigateByUserType(user.user_type);
        }
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.code === "ERR_NETWORK" || !error.response) {
        // Server is unreachable
        setSnackbarMessage(`Server is not reachable.Please try again later or enable this link https://${window.location.hostname}:4000/.`);
      } else {

        setSnackbarMessage("Failed! Enter correct user ID and password.");
      }

      setOpen(true);
    } finally {
      setLoading(false);
    }
  };


  const handleOtpSubmit = async () => {

    try {
      const otpResponse = await Axios.post(
        `https://${window.location.hostname}:4000/log/verify_otp`,
        {
          user_id: userId,
          otp,
        }
      );

      const { token, user, campaigns } = otpResponse.data;
console.log("🔑 Raw JWT Token:", token);
console.log("🔑 Raw user:", user);
      const permissionsRes = await Axios.get(
        `https://${window.location.hostname}:4000/permissions/${user.user_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      login(user, token, permissionsRes.data);
      navigateByUserType(user.user_type);
    } catch (err) {
      console.error("OTP verification failed:", err);
      setSnackbarMessage("Invalid or expired OTP.");
      setOpen(true);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      const response = await Axios.post(
        `https://${window.location.hostname}:4000/log/resend-otp`,
        { user_id: userId }
      );

      if (response.data.success) {
        toast.success("OTP resent successfully!");
        setCountdown(60);
        setOtpExpired(false);
        setResendDisabled(true);
      } else {
        toast.error("Failed to resend OTP.");
      }
    } catch (err) {
      toast.error("Error resending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignSelect = (event) => {
    setSelectedCampaign(event.target.value);
  };
  const handleCampaignSubmit = async () => {
    if (!selectedCampaign) {
      setOpen(true);
      return;
    }

    try {
      setLoading(true);
      const tempUser = JSON.parse(localStorage.getItem("tempUser"));
      const tempToken = localStorage.getItem("tempToken");
      const tempPermissions = JSON.parse(
        localStorage.getItem("tempPermissions")
      );

      const response = await Axios.post(
        `https://${window.location.hostname}:4000/log/select_campaign`,
        { user_id: tempUser.user_id, campaign_id: selectedCampaign }
      );

      if (response.data.success) {
        login(tempUser, tempToken, tempPermissions);

        localStorage.removeItem("tempUser");
        localStorage.removeItem("tempToken");
        localStorage.removeItem("tempPermissions");

        navigateByUserType(tempUser.user_type);
      } else {
        throw new Error("Campaign selection failed");
      }
    } catch (error) {
      console.error("Campaign selection error:", error);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

   return (
  <>
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={() => setOpen(false)} severity="error" sx={{ width: "100%" }}>
        {snackbarMessage}
      </Alert>
    </Snackbar>

    <Box
      sx={{
        backgroundImage: `url(${bgimg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >

      <Box
  component="img"
  src="/logo-old.png"
  alt="Company Logo"
  sx={{ position: "absolute", top: 16, left: 16, height: 50, zIndex: 2000 }}
/>

      <Grid
        container
        sx={{
          maxWidth: 900,
          borderRadius: 4,
          overflow: "hidden",
          bgcolor: "white",
          boxShadow: 4,
        }}
      >
        {/* ✅ Lottie animation on left (desktop only) */}
        <Grid
          item
          xs={false}
          md={6}
          sx={{
            background: "#fff",
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            minHeight: 400,
          }}
        >
<Suspense fallback={<div>Loading animation...</div>}>
  <Player
    autoplay
    loop
    src="/images/ani4.json"
    style={{ height: "100%", width: "100%" }}
  />
</Suspense>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          sx={{
            p: { xs: 4, sm: 5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            bgcolor: "#3b33d5",
            color: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box sx={{ display: { xs: "block", md: "none" }, mb: 2, width: "100%" }}>
              <Player
                autoplay
                loop
                src="/images/ani4.json"
                style={{ width: "100%", maxHeight: 200 }}
              />
            </Box>

            <Avatar sx={{ mb: 1, bgcolor: "white", color: "#3b33d5" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
              Sign In
            </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ width: "100%" }}
              >
                {!isLoggedIn && !showOtp && (
                  <>
                    <TextField
                      fullWidth
                      required
                      variant="outlined"
                      label="User ID"
                      onChange={(e) => setUserId(e.target.value)}
                      InputLabelProps={{ style: { color: "white" } }}
                      InputProps={{ style: { color: "white" } }}
                      sx={{
                        mb: 2,
                        borderRadius: 1,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "white" },
                          "&:hover fieldset": { borderColor: "#FF9A01" },
                          "&.Mui-focused fieldset": { borderColor: "#FF9A01" },
                        },
                        "& .MuiInputLabel-root": { color: "white" },
                      }}
                    />

                    <TextField
                      fullWidth
                      required
                      type="password"
                      variant="outlined"
                      label="Password"
                      onChange={(e) => setPassword(e.target.value)}
                      InputLabelProps={{ style: { color: "white" } }}
                      InputProps={{ style: { color: "white" } }}
                      sx={{
                        mb: 2,
                        borderRadius: 1,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "white" },
                          "&:hover fieldset": { borderColor: "#FF9A01" },
                          "&.Mui-focused fieldset": { borderColor: "#FF9A01" },
                        },
                        "& .MuiInputLabel-root": { color: "white" },
                      }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      endIcon={
                        loading && <CircularProgress size={20} color="inherit" />
                      }
                      sx={{
                        mt: 1,
                        borderRadius: 3,
                        bgcolor: "#FF9A01",
                        "&:hover": { bgcolor: "#e08800" },
                      }}
                    >
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                  </>
                )}

                {/* Show OTP input after successful login request that requires OTP */}
                {showOtp && (
                  <>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Enter the OTP sent to your email and phone
                    </Typography>

                    <TextField
                      fullWidth
                      required
                      variant="outlined"
                      label="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      sx={{
                        mb: 2,
                        input: { color: "white" },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "white" },
                        },
                        "& .MuiInputLabel-root": { color: "white" },
                      }}
                    />

                    {/* Resend OTP + Timer Row */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <IconButton
                        onClick={handleResendOTP}
                        disabled={resendDisabled}
                        sx={{ color: resendDisabled ? "gray" : "white", mr: 1 }}
                        title="Resend OTP"
                      >
                        <Refresh />
                      </IconButton>
                      <Typography variant="body2" color="white">
                        {resendDisabled ? `Resend OTP in ${countdown}s` : "You can resend OTP"}
                      </Typography>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleOtpSubmit}
                      disabled={loading || otpExpired}
                      endIcon={loading && <CircularProgress size={20} color="inherit" />}
                      sx={{
                        mt: 1,
                        borderRadius: 3,
                        bgcolor: otpExpired ? "#ccc" : "#FF9A01",
                        "&:hover": {
                          bgcolor: otpExpired ? "#ccc" : "#e08800",
                        },
                      }}
                    >
                      {otpExpired ? "OTP Expired" : loading ? "Verifying..." : "Verify OTP"}
                    </Button>
                  </>
                )}
                {showCampaignDropdown && campaigns.length > 0 && (
                  <>
                    <FormControl
                      fullWidth
                      sx={{
                        mt: 3,
                        borderRadius: 1,
                        "& .MuiOutlinedInput-root": {
                          color: "white",
                          "& fieldset": {
                            borderColor: "white",
                          },
                          "&:hover fieldset": {
                            borderColor: "#FF9A01",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#FF9A01",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "white",
                        },
                        "& .MuiSvgIcon-root": {
                          color: "white", // Dropdown arrow icon
                        },
                      }}
                    >
                      <InputLabel id="campaign-select-label">
                        Campaign
                      </InputLabel>
                      <Select
                        labelId="campaign-select-label"
                        value={selectedCampaign}
                        onChange={handleCampaignSelect}
                        label="Campaign"
                      >
                        {campaigns.map((id) => (
                          <MenuItem key={id} value={id}>
                            {id}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Button
                      onClick={handleCampaignSubmit}
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      endIcon={
                        loading && (
                          <CircularProgress size={20} color="inherit" />
                        )
                      }
                      sx={{
                        mt: 2,
                        borderRadius: 3,
                        bgcolor: "#FF9A01",
                        "&:hover": {
                          bgcolor: "#e08800",
                        },
                      }}
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
