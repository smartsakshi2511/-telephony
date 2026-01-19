import React, { useState } from "react";
import { styled, keyframes } from "@mui/system";
import {
  Typography,
  Grid,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { Player } from "@lottiefiles/react-lottie-player";
import MessageTemplates from "./Sms";
import WhatsAppTemplates from "./whatsappTemplate";

// Pulse animation
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

const FlipCard = styled("div")({
  perspective: "1000px",
  cursor: "pointer",
  transition: "transform 0.3s ease",
  "&:hover": {
    animation: `${pulse} 0.8s ease-in-out`,
    boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
  },
});

const CardInner = styled("div", {
  shouldForwardProp: (prop) => prop !== "flipped",
})(({ flipped }) => ({
  position: "relative",
  width: "100%",
  height: "300px",
  transformStyle: "preserve-3d",
  transition: "transform 0.6s",
  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
  borderRadius: "24px",
  boxShadow: "0 14px 45px rgba(0,0,0,0.2)",
}));

const CardFace = styled("div")({
  position: "absolute",
  width: "100%",
  height: "100%",
  borderRadius: "24px",
  backfaceVisibility: "hidden",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "28px",
  boxSizing: "border-box",
  textAlign: "center",
  color: "#fff",
});

const FrontFace = styled(CardFace, {
  shouldForwardProp: (prop) => prop !== "bg",
})(({ bg }) => ({
  background: bg,
}));

const BackFace = styled(CardFace)({
  background: "#fafafa",
  color: "#333",
  transform: "rotateY(180deg)",
  boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
});

const IconWrapper = styled(Box)({
  marginBottom: "16px",
  transition: "transform 0.4s ease",
  "&:hover": {
    transform: "scale(1.2) rotate(5deg)",
  },
});

const CommunicationTypeSelector = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [flippedCard, setFlippedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const handleFlip = (type) => {
    setLoading(true);
    setFlippedCard(type);
    setTimeout(() => {
      setSelectedType(type);
      setLoading(false);
    }, 600);
  };

  // Loader during transition
  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Player
          autoplay
          loop
          src="/images/ani1.json"
          style={{ height: 150, width: 150 }}
        />
      </Box>
    );
  }

  if (selectedType === "text") return <MessageTemplates />;
  if (selectedType === "whatsapp") return <WhatsAppTemplates />;

  return (
    <Box sx={{ p: isSmall ? 2 : 6 }}>

      <Grid container spacing={isSmall ? 4 : 6} justifyContent="center">
        {/* Text SMS Card */}
        <Grid item xs={12} sm={8} md={5}>
          <FlipCard onClick={() => handleFlip("text")}>
            <CardInner flipped={flippedCard === "text"}>
              <FrontFace bg="linear-gradient(to right, #42a5f5, #478ed1)">
                <IconWrapper>
                  <Player
                    autoplay
                    loop
                    src="/images/newsms.json"
                    style={{ height: 90, width: 90 }}
                  />
                </IconWrapper>
                <Typography variant="h5" fontWeight={700}>
                  Text Message
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Send SMS using predefined templates.
                </Typography>
              </FrontFace>
              <BackFace>
                <Typography variant="subtitle1" fontWeight={600}>
                  Tap to view Text Message Templates
                </Typography>
              </BackFace>
            </CardInner>
          </FlipCard>
        </Grid>
        <Grid item xs={12} sm={8} md={5}>
          <FlipCard onClick={() => handleFlip("whatsapp")}>
            <CardInner flipped={flippedCard === "whatsapp"}>
              <FrontFace bg="linear-gradient(to right, #42a5f5, #478ed1)">
                <IconWrapper>
                  <Player
                    autoplay
                    loop
                    src="/images/Animationwhat.json"
                    style={{ height: 90, width: 90 }}
                  />
                </IconWrapper>
                <Typography variant="h5" fontWeight={700}>
                  WhatsApp Message
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Send WhatsApp templates instantly.
                </Typography>
              </FrontFace>
              <BackFace>
                <Typography variant="subtitle1" fontWeight={600}>
                  Tap to view WhatsApp Templates
                </Typography>
              </BackFace>
            </CardInner>
          </FlipCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CommunicationTypeSelector;
