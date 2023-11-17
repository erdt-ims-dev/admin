import { Avatar, Box } from "@mui/material";

const UserInfoCard = ({ imgSrc, name, course, yearLevel, size = 100 }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "12px",
        alignItems: "center",
      }}
    >
      <Avatar alt={name} src={imgSrc} sx={{ height: size, width: size }} />
      <Box sx={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
        <h5 className="user-info-name">{name}</h5>
        <p>{course}</p>
        {yearLevel && <p>{yearLevel} year</p>}
      </Box>
    </Box>
  );
};

export default UserInfoCard;
