import { Button, type ButtonProps } from "@mui/material";
import { type ReactElement } from "react";

function LeftAlignedButton({
  children,
  sx,
  ...props
}: ButtonProps): ReactElement {
  return (
    <Button
      {...props}
      sx={{
        justifyContent: "flex-start",
        textAlign: "left",
        width: "100%",
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}

export default LeftAlignedButton;
