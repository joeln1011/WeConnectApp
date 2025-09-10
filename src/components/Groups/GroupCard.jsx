import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@components/Button";
import { CardContent } from "@mui/material";
import { useUserInfo } from "@hooks/index";
const GroupCard = ({ groupInfor = {} }) => {
  const { _id } = useUserInfo();
  const isJoined = (groupInfor?.members || []).includes(_id);
  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image="https://placehold.co/160x90"
        alt="group-banner"
      />
      <CardContent>
        <Typography variant="h6" component="div">
          {groupInfor?.name || "Group Name"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {groupInfor?.description || "Group Description"}
        </Typography>
        <Box display="flex" gap={1}>
          {isJoined ? (
            <Button
              size="small"
              variant="contained"
              inputProps={{ color: "error", fullWidth: true }}
            >
              Leave
            </Button>
          ) : (
            <Button
              size="small"
              variant="contained"
              inputProps={{ fullWidth: true }}
            >
              Join
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default GroupCard;
