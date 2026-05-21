import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  dialog: {
    borderRadius: "16px !important",
    padding: "0 !important",
    overflow: "hidden",
  },
  dialogSmall: {
    width: "480px",
    maxHeight: "80vh",
  },
  dialogLarge: {
    width: "700px",
    maxHeight: "80vh",
  },
}));
