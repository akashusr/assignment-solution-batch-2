import React from "react";
import { FadeLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "#3B82F6",
};

const LoadingSpinner = ({ customClass = "height-200" }) => {
  return (
    <div className={`${customClass} flex align-center justify-center`}>
      <FadeLoader
        color="#3B82F6"
        loading={true}
        cssOverride={override}
        size={100}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default LoadingSpinner;
