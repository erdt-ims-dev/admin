import { useParams } from "react-router-dom";
import "./style.scss";
import UserInfoCard from "../generic/UserInfoCard";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Button } from "react-bootstrap";

const mockScholarData = [
  {
    id: "test_id_0",
    name: "Edward Rose",
    program: "MS-ME",
    yearLevel: "3rd",
  },
  {
    id: "test_id_1",
    name: "Lorenzo Scott",
    program: "MS-ME",
    yearLevel: "3rd",
  },
  {
    id: "test_id_2",
    name: "Kylie Bradley",
    program: "MS-CE",
    yearLevel: "4th",
  },
  {
    id: "test_id_3",
    name: "John Doe",
    program: "MS-ME",
    yearLevel: "2nd",
  },
];

const mockGetScholarDetails = async (scholarId) => {
  const scholar = mockScholarData.find(({ id }) => id === scholarId);

  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          status: 200,
          data: scholar,
        }),
      250
    );
  });
};

const ViewScholar = () => {
  const [scholar, setScholar] = useState(null);
  const { scholarId } = useParams();

  useEffect(() => {
    const getScholar = async () => {
      const response = await mockGetScholarDetails(scholarId);

      if (response.status !== 200) {
        console.error("There was an error in fetching scholar details.");
        return;
      }

      setScholar(response.data);
    };

    getScholar();
  }, [scholarId]);

  if (!scholar) return <>Loading...</>;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <UserInfoCard
          name={scholar.name}
          course={scholar.program}
          yearLevel={scholar.yearLevel}
          src=""
        />

        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Button>Leave applications</Button>
          <Box sx={{ display: "flex", gap: "8px" }}>
            <Button>Portfolio</Button>
            <Button>Submitted files</Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ViewScholar;
