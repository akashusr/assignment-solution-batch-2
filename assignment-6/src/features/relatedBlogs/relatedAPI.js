import { size } from "lodash";
import axiosInstance from "utils/axios";

export const getRelatedBlogs = async ({ tags, id }) => {
  const limit = 5;
  const queryString = size(tags)
    ? tags?.map((tag) => `tags_like=${tag}`)?.join("&") +
      `&id_ne=${id}&_limit=${limit}`
    : `id_ne=${id}&_limit=${limit}`;

  const response = await axiosInstance.get(`/blogs?${queryString}`);

  return response?.data;
};
