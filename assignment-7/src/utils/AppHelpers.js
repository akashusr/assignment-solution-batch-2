import { toast } from "react-toastify";

export const getJobType = (type) =>
  type?.split(" ")?.join("_")?.toLowerCase() || "";

export const getJobTypeColor = (type) => {
  if (getJobType(type) === "internship") {
    return "#FF5757";
  }
  if (getJobType(type) === "remote") {
    return "#56E5C4";
  }
  return "#FF8A00";
};

export const numberWithCommas = (value) => {
  return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const getJobHeaderTitle = (selectedType) => {
  if (selectedType === "internship") {
    return "Available Internship";
  }
  if (selectedType === "full_time") {
    return "Available Full Time";
  }
  if (selectedType === "remote") {
    return "Available Remote";
  }
  return "All Available";
};

// alert message
export const toastAlert = (type, value) => {
  if (type === "success") {
    toast.success(value, {
      theme: "dark",
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  } else if (type === "error") {
    toast.error(value, {
      theme: "dark",
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  }
};
