import axiosInstance from "utils/axiosInstance";

// jobs
export const getJobs = async () => {
  const response = await axiosInstance.get("/jobs");
  return response.data;
};

// add job
export const addJob = async (mutationData) => {
  const response = await axiosInstance.post("/jobs", mutationData, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
  return response.data;
};

// single job
export const getSingleJob = async (id) => {
  const response = await axiosInstance.get(`/jobs/${id}`);
  return response.data;
};

// update job
export const updateJob = async (id, mutationData) => {
  const response = await axiosInstance.patch(`/jobs/${id}`, mutationData, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
  return response.data;
};

// delete job
export const deleteJob = async (id) => {
  const response = await axiosInstance.delete(`/jobs/${id}`);
  return response.data;
};
