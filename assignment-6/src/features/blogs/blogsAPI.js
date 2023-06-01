import axiosInstance from "utils/axios";

export const getBlogs = async () => {
  const response = await axiosInstance.get("/blogs");

  return response.data;
};

export const updateBlog = async ({ id, mutationData }) => {
  const response = await axiosInstance.patch(`/blogs/${id}`, mutationData, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });

  return response.data;
};
