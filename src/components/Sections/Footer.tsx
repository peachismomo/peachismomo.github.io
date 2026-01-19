import { Stack, IconButton } from "@mui/material";
import type { ReactNode } from "react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

const iconSize = 28;

function Footer(): ReactNode {
  return (
    <Stack direction="row" spacing={3} justifyContent="center">
      <IconButton
        component="a"
        href="https://github.com/peachismomo"
        target="_blank"
      >
        <FaGithub size={iconSize} />
      </IconButton>

      <IconButton
        component="a"
        href="https://linkedin.com/in/ian-chua-rong-bin"
        target="_blank"
      >
        <FaLinkedin size={iconSize} />
      </IconButton>

      <IconButton
        component="a"
        href="https://instagram.com/peachismomo_"
        target="_blank"
      >
        <FaInstagram size={iconSize} />
      </IconButton>
    </Stack>
  );
}

export default Footer;
