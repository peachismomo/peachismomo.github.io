import { Box, type SxProps, type Theme } from "@mui/material";
import { type ReactNode } from "react";

interface CenteredBoxProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

const CenteredBox = ({ children, sx = {} }: CenteredBoxProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default CenteredBox;
