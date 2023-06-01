import React from "react";
import { Oval } from "react-loader-spinner";

const ModalSpinner = () => {
  return (
    <div className="flex align-center justify-center padding-60">
      <Oval
        color="rgb(52 181 253 / 1"
        secondaryColor="rgb(52 181 253 / 1"
        height={80}
        width={80}
        strokeWidth={2}
      />
    </div>
  );
};

export default ModalSpinner;
