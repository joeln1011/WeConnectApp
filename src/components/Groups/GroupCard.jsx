import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { GroupActionButtons } from "./GroupActionButtons";

const GroupCard = ({
  id,
  name,
  coverImage,
  description,
  isMember,
  isRequestSent,
  role,
}) => {
  return (
    <Link to={`/groups/${id}`} className="flex h-full">
      <Card sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <CardMedia
          component="img"
          height="160"
          image={coverImage || "https://placehold.co/160x90"}
          alt="group-banner"
          className="h-40 w-full object-cover"
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
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {description}
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <GroupActionButtons
              id={id}
              isMember={isMember}
              isRequestSent={isRequestSent}
              role={role}
            />
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};
export default GroupCard;
