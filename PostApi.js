import axios from "axios";

export const getAllPosts = async () => {
  const response = await axios.get(`https://gorest.co.in/public/v2/posts`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
};
