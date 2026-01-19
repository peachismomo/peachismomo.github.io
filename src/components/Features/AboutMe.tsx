import { Box, Divider, Typography } from "@mui/material";
import type { ReactNode } from "react";

function AboutMe(): ReactNode {
  return (
    <Box padding={"10px"}>
      <Box>
        <Typography variant="h2">Ian Chua</Typography>
        <Divider sx={{ mt: "3vh", mb: "3vh" }} />
      </Box>

      <Typography variant="h4" sx={{ mb: "5vh" }}>
        Software Engineer
      </Typography>

      <Typography variant="h6" color="grey">
        Don&apos;t be sorry, be better.
      </Typography>
      <Typography sx={{ mt: "5vh" }}>
        As a student at Singapore Institute of Technology, DigiPen, specializing
        in Real-Time Interactive Simulation, I am deeply passionate about the
        intersection of technology and creativity. My academic journey has
        equipped me with a solid foundation in developing tools and graphics
        programming, and I am excited to apply this knowledge in innovative
        ways.
        <br />
        <br />
        Lately, I have been diving deeper into the world of shaders, exploring
        various techniques to enhance the visual appeal of scenes. This newfound
        interest has driven me to experiment with different methods, pushing the
        boundaries of what can be achieved in real-time graphics.
        <br />
        <br />
        I thrive on the challenges of creating efficient, visually stunning
        interactive experiences and am always eager to learn and grow in this
        ever-evolving field. My goal is to contribute to cutting-edge projects
        that redefine the limits of real-time graphics and interactive
        simulations.
        <br />
        <br />
        Feel free to connect with me if you share a passion for graphics
        programming, tool development, or if you have exciting projects and
        ideas to discuss.
      </Typography>
    </Box>
  );
}

export default AboutMe;
