import React from "react";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: "18px !important",
    fontSize: "1.8rem !important",
    color: "#FFFFFF !important",
  },
  makorSpan: {
    fontFamily: "MakorFont",
    color: "#54A9FF",
    fontSize: "2rem !important",
  },
  viewAs: {
    marginTop: "18px !important",
    fontSize: "1.3rem !important",
    color: "#FFFFFF !important",
  },
  auction: {
    color: "#989EA8",
    fontSize: "1.75rem",
    textAlign: "left",
  },
  newAuctionButton: {
    background: "#54A9FF",
    borderRadius: "4px",
    width: "147px",
    height: "32px",
    // marginRight: "10px",
    textTransform: "none",
    textAlign: "center",
    fontSize: "1.166rem",
    color: "#000000",
    "&:Hover": {
      backgroundColor: "#9ACCFF",
    },
  },
  cancelAllButton: {
    background: "#FF9E54",
    borderRadius: "4px",
    width: "147px",
    height: "32px",
    // marginRight: "10px",
    textTransform: "none",
    textAlign: "center",
    fontSize: "1.166rem",
    color: "#000000",
    fontWeight: 600,
    "&:Hover": {
      backgroundColor: "#FFC67C",
    },
  },
  tableContainerSx: {},
  buttonOverride: {
    outline: "none",
    boxShadow: "none",
  },
  minimize: {
    color: "#FF9E54",
    fontSize: "1.33rem",
    textDecoration: "underline",
    textTransform: "none",
  },
  systemLogString: {
    fontSize: "1.75rem",
    color: "#989EA8",
  },
  dataTableBody: {
    "& tr:nth-of-type(odd)": {
      backgroundColor: "#2d2d2d !important",
    },
    "& tr:nth-of-type(even)": {
      backgroundColor: " #222222 !important",
    },
  },
  userOnlineDataTableBody: {
    "& tr:nth-of-type(odd)": {
      backgroundColor: "#222222  !important",
      height:"1px !important"
    },
    "& tr:nth-of-type(even)": {
      backgroundColor: " #2d2d2d !important",
      height:"1px !important"
    },
  },
  dataTableCell: {
    fontSize: "13px !important",
    color: "#ffffff !important",
    textAlign: "center !important",
    borderBottom: "none",
    whiteSpace: "nowrap",
  },
  userOnlineDataTableCell: {
    fontSize: "10px !important",
    color: "#ffffff !important",
    textAlign: "center !important",
    borderBottom: "none",
    whiteSpace: "nowrap",
  },
  headerTableRow: {
    fontSize: "1.08rem",
    color: "#5a5c62",
    textAlign: "center",
    borderBottom: "none",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  selectOutline: {
    "&.MuiOutlinedInput-root": {
      color: "#ffffff",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#54a9ff",
      },
    },
    "& .MuiSvgIcon-root": {
      color: "#54a9ff",
    },
  },
  selectedMenuItem: {
    backgroundColor: "#yourSelectedColor",
    "&.Mui-selected": {
      backgroundColor: "rgb(84, 169, 255,0.3)",
    },
    "&:hover": {
      backgroundColor: "rgb(84, 169, 255,0.4)", // For hover state (optional)
    },
  },
  auctionGrid: {
    maxHeight: "calc(100vh - 61px)",
    overflow: "auto",
    "@media (max-width: 1250px)": {
      width: "100%",
    },
    "@media (min-width: 1251px)": {
      width: "900px",
    },
    "@media (min-width: 2559px)": {
      width: "990px",
    },
  },
  auctionTitleGrid: {
    "@media (max-width: 890px)": {
      minWidth: "100% !important",
    },
  },
  systemLogsGrid: {
    "@media (max-width: 1250px)": {
      display: "none",
    },
    "@media (min-width: 1251px)": {
      width: "calc(100% - 910px)",
    },
    "@media (min-width: 2559px)": {
      width: "calc(100% - 1000px)",
    },
  },
  searchAndRegionSelectGrid: {
    // "@media (min-width: 1251px)": {
    //   width: 520,
    // },
    "@media (max-width: 2560px)": {
      width: 550,
    },
    "@media (min-width: 1920px)": {
      width: 650,
    },
    "@media (max-width: 1920px)": {
      width: 550,
    },
    "@media (max-width: 1602px)": {
      width: 500,
    },
    "@media (max-width: 1552px)": {
      width: 420,
    },
    "@media (max-width: 1502px)": {
      width: 420,
    },
    "@media (max-width: 1472px)": {
      width: "fit-content",
    },
    "@media (max-width: 1405px)": {
      width: "fit-content",
    },
    "@media (max-width: 1404px)": {
      width: "320px",
    },
  },
  mainWorkspaceContainer: {
    "@media (min-width: 901px)": {
      width: "calc(100vw - 74px)",
    },
    "@media (max-width: 901px)": {
      padding: "0px 15px",
      width: "calc(100vw)",
    },
  },
  customTooltip: {
    // maxHeight: "200px",
    // overflowY: "auto",
    // padding:"15px",
    // margin:"20px",
    // fontSize:"15px",
   
  },
  tooltipHeaderTableRow: {
    overflowY: "auto"
  },
  
  userOnlineHeaderTableRow: {
    fontSize: "10px",
    color: "#5a5c62",
    textAlign: "center",
    borderBottom: "none",
    fontWeight: "600",
    backgroundColor: "#2d2d2d",
    color:"#5a5c62 !important",
    borderBottom: "1px solid #000000 !important"
  },
}));
