import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@components/Button";
import { CardContent } from "@mui/material";

const GroupCard = ({
  id,
  name,
  description,
  isJoined,
  onJoinClick,
  onLeaveClick,
  isJoining,
  isLeaving,
  isOwner,
}) => {
  return (
    <Card sx={{ display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="img"
        height="140"
        image="https://placehold.co/160x90"
        alt="group-banner"
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <Box>
          <Typography variant="h6" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          {!isOwner &&
            (isJoined ? (
              <Button
                size="small"
                variant="contained"
                inputProps={{ color: "error", fullWidth: true }}
                onClick={() => {
                  onLeaveClick(id, name);
                }}
                isLoading={isLeaving}
              >
                Leave
              </Button>
            ) : (
              <Button
                size="small"
                variant="contained"
                inputProps={{ fullWidth: true }}
                onClick={() => {
                  onJoinClick(id, name);
                }}
                isLoading={isJoining}
              >
                Join
              </Button>
            ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default GroupCard;
