import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  cardsRow: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  filtersRow: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
}));
