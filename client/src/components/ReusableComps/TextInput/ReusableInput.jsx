import React from "react";
import ReusableInputView from "./ReusableInput.view";

const ReusableInput = (props) => {
  const { type, onChange, placeHolder, value, label,pattern } = props;

  return (
    <ReusableInputView
      label={label}
      type={type}
      onChange={onChange}
      placeHolder={placeHolder}
      value={value}
    />
  );
};

export default ReusableInput;
