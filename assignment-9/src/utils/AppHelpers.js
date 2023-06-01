import { toast } from "react-toastify";

export const getProjectNameKey = (projectName) =>
  projectName?.split(" ")?.join("_")?.toLowerCase() || "default";

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
