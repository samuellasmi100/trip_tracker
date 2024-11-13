import { TabPanel } from "@mui/lab";
import { Tab } from "@mui/material";
import { styled } from "@mui/styles";

export const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "capitalize",
    fontWeight: 500,
    fontSize: "1.125rem",
    marginRight: "2px",
    color: "#989EA8 !important",
    width: "108px",
    backgroundColor: "#222222 !important",
    borderRadius: "4px 4px 0 0",
    "&.Mui-selected": {
      color: "#ffffff !important",
      backgroundColor: "#2d2d2d !important",
    },
  })
);

export const StyledTabPanel = styled((props) => (
  <TabPanel
    {...props}
    style={{ borderRadius: "0px 4px 4px 4px" }}
    tabindicatorprops={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "&.MuiTabPanel-root": {
    "@media (min-width: 901px)": {
      width: "calc(100vw - 85px)",
    },
    "@media (max-width: 901px)": {
      padding: "0px 10px",
      width: (props) =>
        props.value === "trades" ? "calc(100vw - 46px)" : "calc(100vw - 40px)",
    },
    height: "calc(100vh - 115px)",
    padding: 0,
    background: "#2d2d2d !important",
  },
});
