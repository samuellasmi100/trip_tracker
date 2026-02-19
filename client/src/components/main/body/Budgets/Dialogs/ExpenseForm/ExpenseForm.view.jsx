import React from "react";
import {
  Typography,
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import { useStyles } from "./ExpenseForm.style";

const paymentCurrencyOptions = ["שקל", "דולר", "יורו"];

const ExpenseFormView = ({
  form,
  categories,
  subCategories,
  isEdit,
  handleInputChange,
  submit,
  closeModal,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography className={classes.title}>
        {isEdit ? "עריכת הוצאה" : "הוספת הוצאה"}
      </Typography>

      {/* Category + SubCategory + Number of payments */}
      <div className={classes.formRow}>
        <div>
          <InputLabel className={classes.inputLabel}>קטגוריה</InputLabel>
          <Select
            name="categories"
            value={form.categories || ""}
            onChange={handleInputChange}
            input={<OutlinedInput className={classes.selectOutline} />}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: "#ffffff",
                  color: "#1e293b",
                  maxHeight: "260px",
                },
              },
            }}
          >
            {categories?.map((cat) => (
              <MenuItem key={cat.id} value={cat.id} className={classes.selectedMenuItem}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div>
          <InputLabel className={classes.inputLabel}>תת קטגוריה</InputLabel>
          <Select
            name="subCategories"
            value={form.subCategories || ""}
            onChange={handleInputChange}
            input={<OutlinedInput className={classes.selectOutline} />}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: "#ffffff",
                  color: "#1e293b",
                  maxHeight: "260px",
                },
              },
            }}
          >
            {subCategories?.map((sub) => (
              <MenuItem key={sub.id} value={sub.id} className={classes.selectedMenuItem}>
                {sub.name}
              </MenuItem>
            ))}
          </Select>
        </div>

        {!isEdit && (
          <div>
            <InputLabel className={classes.inputLabel}>מספר תשלומים</InputLabel>
            <TextField
              name="numberOfPayments"
              value={form.numberOfPayments || 1}
              onChange={handleInputChange}
              className={classes.shortTextField}
              type="number"
              inputProps={{ min: 1 }}
            />
          </div>
        )}
      </div>

      {/* Payment rows */}
      <div className={classes.paymentsScroll}>
        {isEdit ? (
          <div className={classes.formRow}>
            <div>
              <InputLabel className={classes.inputLabel}>סכום</InputLabel>
              <TextField
                name="expenditure0"
                value={form.expenditure0 || ""}
                onChange={handleInputChange}
                className={classes.textField}
              />
            </div>
            <div>
              <InputLabel className={classes.inputLabel}>תאריך תשלום</InputLabel>
              <TextField
                type="date"
                name="paymentDate0"
                value={form.paymentDate0 || ""}
                onChange={handleInputChange}
                className={classes.textField}
              />
            </div>
            <div>
              <InputLabel className={classes.inputLabel}>מטבע</InputLabel>
              <Select
                name="paymentCurrency0"
                value={form.paymentCurrency0 || ""}
                onChange={handleInputChange}
                input={<OutlinedInput className={classes.selectOutline} />}
                MenuProps={{
                  PaperProps: {
                    sx: { bgcolor: "#ffffff", color: "#1e293b" },
                  },
                }}
              >
                {paymentCurrencyOptions.map((cur) => (
                  <MenuItem key={cur} value={cur} className={classes.selectedMenuItem}>
                    {cur}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
        ) : (
          Array.from({ length: parseInt(form.numberOfPayments) || 1 }).map((_, index) => (
            <div className={classes.formRow} key={index}>
              <div>
                <InputLabel className={classes.inputLabel}>סכום</InputLabel>
                <TextField
                  name={`expenditure${index}`}
                  value={form[`expenditure${index}`] || ""}
                  onChange={handleInputChange}
                  className={classes.textField}
                />
              </div>
              <div>
                <InputLabel className={classes.inputLabel}>תאריך תשלום</InputLabel>
                <TextField
                  type="date"
                  name={`paymentDate${index}`}
                  value={form[`paymentDate${index}`] || ""}
                  onChange={handleInputChange}
                  className={classes.textField}
                />
              </div>
              <div>
                <InputLabel className={classes.inputLabel}>מטבע</InputLabel>
                <Select
                  name={`paymentCurrency${index}`}
                  value={form[`paymentCurrency${index}`] || ""}
                  onChange={handleInputChange}
                  input={<OutlinedInput className={classes.selectOutline} />}
                  MenuProps={{
                    PaperProps: {
                      sx: { bgcolor: "#ffffff", color: "#1e293b" },
                    },
                  }}
                >
                  {paymentCurrencyOptions.map((cur) => (
                    <MenuItem key={cur} value={cur} className={classes.selectedMenuItem}>
                      {cur}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Actions */}
      <div className={classes.actions}>
        <Button onClick={submit} className={classes.submitButton}>
          {isEdit ? "עדכן" : "הוסף הוצאה"}
        </Button>
        <Button onClick={closeModal} className={classes.cancelButton}>
          ביטול
        </Button>
      </div>
    </div>
  );
};

export default ExpenseFormView;
