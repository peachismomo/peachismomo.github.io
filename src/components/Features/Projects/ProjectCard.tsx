import { styled } from "@mui/material/styles";
import {
  type IconButtonProps,
  IconButton,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Collapse,
  Link,
  CardActions,
} from "@mui/material";
import { type ReactNode, useState } from "react";
import type { ProjectProps } from "../../../types/types";
import { GitHubReadme } from "react-github-readme-md";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "expand",
})<ExpandMoreProps>(({ theme, expand }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  transform: expand ? "rotate(180deg)" : "rotate(0deg)",
}));

function Project(props: ProjectProps): ReactNode {
  const [expanded, setExpanded] = useState<boolean>(false);
  const handleExpandClick = (): void => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ background: "theme.background.paper" }}>
      <CardActionArea>
        {/* <CardMedia
          component={props.isVideo ? "video" : "img"}
          image={props.img}
          height="100%"
          autoPlay
          muted
          loop
        /> */}
        <CardContent>
          <Typography variant="h5" sx={{ color: "text.primary" }}>
            {props.full_name}
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {props.description}
          </Typography>
        </CardContent>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            {/* <Typography sx={{ marginBottom: 2 }}>
              {props.dateStart.toDateString()} - {props.dateEnd.toDateString()}
            </Typography> */}
            {props.html_url ? (
              <Link
                sx={{ marginBottom: 2 }}
                href={props.html_url}
                target="_blank"
                rel="noreferrer"
              >
                Click here to see project on GitHub.
              </Link>
            ) : (
              <></>
            )}

            <Typography sx={{ marginBottom: 2 }}>
              {props.description}
            </Typography>
            {/* <ReactMarkdown>
              {props.markdown}
            </ReactMarkdown> */}
            <GitHubReadme
              username="peachismomo"
              repo={props.name}
              className="dark"
            />
          </CardContent>
        </Collapse>
      </CardActionArea>
      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
    </Card>
  );
}

export default Project;
