import React from "react";
import { makeStyles, styled } from "@mui/styles";
import { TableCell } from "@mui/material";

export const useStyles = makeStyles((theme) => ({
  dialog: {
    minWidth: "697px !important",
    maxWidth: "697px !important",
    height: "655px",
    color: "#FFFFFF !important",
    backgroundColor: "#2D2D2D !important",
  },
  inputLabelStyle: {
    color: "#757882",
    fontSize: "1rem",
  },
  header: {
    textAlign: "left",
    color: "#ffffff",
    font: "normal normal normal 1.33rem/1.33rem Inter",
  },
  cancelButton: {
    color: "#ffffff !important",
    fontSize: "1.125rem",
    textTransform: "capitalize !important",
    width: "136px",
    height: "32px",
    /* UI Properties */
    background: "#494C55 0% 0% no-repeat padding-box !important",
    borderRadius: "4px",
    opacity: 1,
  },
  submitButton: {
    color: "#000000 !important",
    fontSize: "1.125rem",
    textTransform: "capitalize !important",
    width: "168px",
    height: "32px",
    /* UI Properties */
    background: "#54A9FF 0% 0% no-repeat padding-box !important",
    borderRadius: "4px",
    opacity: 1,
    "&:hover": {
      backgroundColor: "#2692ff !important",
    },
  },
  uploadButton: {
    fontSize : "1.125rem",
    textDecoration: "underline",
    textTransform: "Capitalize",
  },
  textField: {
    // borderRadius: 4,
    "& .MuiInputBase-input": {
      // position: "relative",
      color: "#FFFFFF",
      fontSize: "14px",
      // width: "auto",
      // padding: "5px 18px",
      height: "0px",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#54A9FF",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#494C55",
      },
      "&:hover fieldset": {
        borderColor: "#494C55",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#54A9FF",
      },
    },
  },
  textFieldNotActive: {
    // borderRadius: 4,
    "& .MuiInputBase-input": {
      // position: "relative",
      color: "#757882",
      fontSize: "14px",
      // width: "auto",
      // padding: "5px 18px",
      height: "0px",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#54A9FF",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#494C55",
      },
      "&:hover fieldset": {
        borderColor: "#494C55",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#54A9FF",
      },
    },
  },
  select: {
    width: "231px",
    height: "32px",
    color: "white",
    textTransform: "capitalize",
    backgroundColor: "#2D2D2D",
    border: "1px solid #494C55",
  },
  headerTableRow: {
    fontSize: "1rem",
    color: "#5a5c62",
    textAlign: "center",
    borderBottom: "1px solid #000000 !important",
    backgroundColor: "#2d2d2d",
  },
  dataTableCell: {
    fontSize: "1rem",
    color: "#ffffff",
    textAlign: "center !important",
    borderBottom: "none",
  },
  tableStyle: {
    width: "100%",
    height: "227px",
  },
  dataTableBody: {
    "& tr:nth-of-type(odd)": {
      backgroundColor: "#222222 !important",
    },
    "& tr:nth-of-type(even)": {
      backgroundColor: "#2d2d2d !important",
    },
  },
  addButton: {
    background: "#494C55 0% 0% no-repeat padding-box",
    borderRadius: "4px",
    opacity: 1,
    textTransform: "capitalize",
    fontSize: "1.166rem",
    width: "67px",
    height: "32px",
  },
  addIcon: {
    width: "15px",
    height: "15px",
    marginBottom: "-1px",
  },
}));
export const StyledTableCell = styled((props) => <TableCell {...props} />)({
  // overflow: "hidden",
  textOverflow: "ellipsis",
  // whiteSpace: "noWrap",
  textAlign: "center",
  paddingBlock: 1,
  paddingInline: 5,
  color: "#ffffff !important",
  borderBottom: "1px solid #b3b3b3",
  "& .MuiTableCell-stickyHeader": {
    backgroundColor: "#000000",
  },
  fontSize: "1rem",
});
