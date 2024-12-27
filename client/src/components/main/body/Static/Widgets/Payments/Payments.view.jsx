import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useStyles } from "./Payments.style";
import React from "react";
import SearchIcon from "@material-ui/icons/Search";
import { ReactComponent as DownloadIcon } from "../../../../../../assets/icons/download.svg";
import DescriptionIcon from "@mui/icons-material/Description";

function PaymentsView({
  filteredPayments,
  searchTerm,
  setSearchTerm,
  headers,
  handleExportToExcel,
  handleEditClick
}) {

  const classes = useStyles();

  return (
    <Grid style={{
      width: "99.9%", maxHeight: "80vh",
    }}>
      <Grid style={{ display: "flex", justifyContent: "flex-end" }}>
        <Grid style={{ marginTop: "5px" }}>
          <FormControl>
            <TextField
              size="small"
              className={classes.textField}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon style={{ color: "rgb(84, 169, 255)" }} />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <IconButton onClick={handleExportToExcel}>
            <DownloadIcon style={{ color: "#54A9FF", fontSize: "30px", border: '1px solid #494C55', padding: "10px", marginTop: "-7", borderRadius: "4px" }} />
          </IconButton>
        </Grid>
      </Grid>
      <TableContainer

      >
        <Table stickyHeader style={{ width: "inherit" }} size="small">
          <TableHead>
            <TableRow>
              {headers.map((header, index) => {
                return (
                  <TableCell
                    key={index}
                    className={classes.headerTableRow}
                    style={{ textAlign: "center" }}
                  >
                    {header}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody className={classes.dataTableBody}>
            {filteredPayments?.map((payment, index) => {
              return (
                <TableRow key={index}>

                  <>
                    <TableCell className={classes.dataTableCell}>
                      {index + 1}
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>
                      {payment?.hebrew_first_name + " " + payment?.hebrew_last_name}
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>
                      {payment?.default_amount}
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>
                      {payment?.remainsToBePaid === null ? payment?.default_amount : payment?.remainsToBePaid}
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>
                      {payment?.invoice === null || payment?.invoice === 0 ? "לא" : "כן"}
                    </TableCell>
                    <TableCell
                      className={classes.dataTableCell}
                      style={{ maxWidth: "1px" }}
                    >
                      <IconButton
                        size={"small"}
                      onClick={() => handleEditClick(payment)}
                      >
                        <DescriptionIcon style={{ color: "rgb(255, 158, 84)" }} />
                      </IconButton>
                    </TableCell>

                  </>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}

export default PaymentsView;
