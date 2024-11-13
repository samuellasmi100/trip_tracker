import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  regionSelect: {
    // justifyContent: "flex-start",
    "@media (min-width: 1443px)": {
      width: 150,
    },
    "@media (min-width: 1680px)": {
      width: 200,
    },
    "@media (max-width: 1679px)": {
      width: 200,
    },
    "@media (min-width: 1920px)": {
      width: 250,
    },
  },
  regionSelectFormControl: {
    "@media (max-width: 2558px)": {
      width: 255,
    },
    "@media (max-width: 1601px)": {
      width: 230,
    },
    "@media (max-width: 1573px)": {
      width: 200,
    },
    "@media (max-width: 1472px)": {
      width: 150,
    },
  },
  regionSelectForSmall: {
    "@media (max-width: 1280px)": {
      // display: "flex",
      position: "relative",
      top: "10px",
      right: "40px",
      // flex: "0 50%",
      // marginTop: "10px",
      // marginRight : 0
      // margin: "0 auto",
    },
  },
  selectOutline: {
    height: "35px",
    "&.MuiOutlinedInput-root": {
      color: "#ffffff !important",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#494c55",
      },
    },
    "& .MuiSvgIcon-root": {
      color: "#54a9ff",
    },
  },
  selectedMenuItem: {
    "&.Mui-selected": {
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: "#3C3E43",
      },
    },
    "&:hover": {
      backgroundColor: "#3C3E43",
    },
  },

  formControl: {
    width: 250,
    "@media (max-width: 1280px)": {
      width: "250px",
    },
    "@media (min-width: 1251px)": {
      width: 200,
    },
    "@media (min-width: 1920px)": {
      width: 250,
    },
    "@media (min-width: 2559px)": {
      width: "calc(100% - 100px)",
    },
  },
}));
