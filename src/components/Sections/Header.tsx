import { Stack, Tabs, Tab, Box } from "@mui/material";
import type { ReactNode } from "react";
import { useTabContext, useElementContext } from "../../context/useTabContext";

function Header(): ReactNode {
  const tabContext = useTabContext();
  const elementsContext = useElementContext();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    tabContext.setSuppressObserver(true);
    tabContext.setCurrentIndex(newValue);

    setTimeout(() => {
      tabContext.setSuppressObserver(false);
    }, 600);

    const targetRef = elementsContext.elements[newValue];

    if (newValue === 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (targetRef?.current) {
      const offset = -100;
      const elementTop =
        targetRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        offset;

      window.scrollTo({
        top: elementTop,
        behavior: "smooth",
      });
    }
  };

  const tabs = ["ABOUT ME", "EXPERIENCE", "PROJECTS"];

  return (
    <Stack spacing={5}>
      <Tabs
        orientation="vertical"
        value={tabContext.currentIndex}
        onChange={handleChange}
      >
        {tabs.map((label, index) => (
          <Tab
            key={label}
            disableRipple
            sx={{
              alignItems: "start",
              paddingLeft: 0,
              color: "text.primary",
              "&.Mui-selected": {
                color: "secondary.main",
              },
            }}
            label={
              <Box
                sx={{
                  transition: "transform 0.3s ease",
                  transform:
                    tabContext.currentIndex === index
                      ? "translateX(15px)"
                      : "translateX(0)",
                }}
              >
                {label}
              </Box>
            }
          />
        ))}
      </Tabs>
    </Stack>
  );
}

export default Header;
