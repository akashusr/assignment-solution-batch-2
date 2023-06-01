import axiosInstance from "utils/axios";

export const getBlogDetails = async (blogId) => {
  const response = await axiosInstance.get(`/blogs/${blogId}`);

  return response.data;
};
