import React from "react";

const NothingToFound = ({ customClass = "" }) => {
  return (
    <div className={`mt-10 ${customClass}`}>
      <p className="m-2 text-center">We did not find anything to show here!</p>
    </div>
  );
};

export default NothingToFound;
