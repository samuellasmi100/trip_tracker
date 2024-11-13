import {
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Checkbox,
} from "@mui/material";
import React from "react";
import { useStyles } from "./RegionSelect.style";
import { useSelector } from "react-redux";

function RegionSelectView({
  selectedRegions,
  handleRegionSelect,
  regionMainClass,
  formControlWidth,
  ...props
}) {
  const classes = useStyles();
  const clientRegions = useSelector((state) => state.regionSlice.regions);
  return (
    <Grid item container className={classes[regionMainClass]} xs={regionMainClass === "regionSelectForSmall" ? 3 : 6}>
      <Grid item xs={12}>
        <FormControl
          size="small"
          className={classes.regionSelectFormControl}
          style={{ width: formControlWidth }}
        >
          <InputLabel
            style={{
              color: "#54a9ff",
            }}
          >
            {`Regions (${selectedRegions.length})`}
          </InputLabel>
          <Select
            multiple
            value={selectedRegions}
            onChange={handleRegionSelect}
            input={
              <OutlinedInput
                label="Regions"
                className={classes.selectOutline}
              />
            }
            renderValue={() => selectedRegions.join(",")}
            MenuProps={{
              PaperProps: {
                sx: {
                  color: "#ffffff !important",
                  bgcolor: "#222222",
                },
              },
            }}
          >
            {clientRegions.map((region) => (
              <MenuItem
                key={region.region_id}
                value={region.region_name}
                className={classes.selectedMenuItem}
              >
                <Checkbox
                style={{marginRight: 10}}
                  sx={{
                    color: "#686B76",
                    "&.Mui-checked": {
                      color: "#54A9FF",
                    },
                  }}
                  checked={
                    selectedRegions.findIndex(
                      (item) => item === region.region_name
                    ) >= 0
                  }
                />
                <ListItemText
                  primaryTypographyProps={{ fontSize: "1.167rem" }}
                  primary={region.region_name}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* <FormControl
          size="small"
          className={classes.regionSelectFormControl}
          style={{ width: formControlWidth }}
        >
          <InputLabel
            style={{
              color: "#54a9ff",
            }}
          >
            Regions
          </InputLabel>
          <Select
            multiple
            label="Regions"
            value={selectedRegions}
            onChange={handleRegionSelect}
            input={
              <OutlinedInput
                label="Regions"
                className={classes.selectOutline}
              />
            }
            MenuProps={{
              PaperProps: {
                sx: {
                  color: "#ffffff !important",
                  bgcolor: "#2f2f2f",
                },
              },
            }}
          >
            {clientRegions?.map((region) => (
              <MenuItem
                key={region.region_id}
                value={region.region_name}
                className={classes.selectedMenuItem}
              >
                <Checkbox
                  checked={
                    clientRegions.findIndex(
                      (item) => item.region_id === region.region_id
                    ) >= 0
                  }
                />
                <ListItemText primary={region.region_name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
      </Grid>
    </Grid>
  );
}

export default RegionSelectView;
