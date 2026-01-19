import { Grid } from "@mui/material";
import { Children, type ReactNode } from "react";

interface GridTemplateProps {
  children: ReactNode;
}

function GridTemplate({ children }: GridTemplateProps): ReactNode {
  const childArray: ReactNode[] = Children.toArray(children);
  return (
    <Grid container spacing={2}>
      {childArray.map((child, index) => {
        return (
          <Grid size={4} key={index}>
            {child}
          </Grid>
        );
      })}
    </Grid>
  );
}

export default GridTemplate;
