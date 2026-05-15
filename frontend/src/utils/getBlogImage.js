import userimg from "../assets/userprofile.png";
import { API_BASE_URL } from "./api";

export const getBlogImage = (thumbnail) => {

  if (
    !thumbnail ||
    thumbnail === "null" ||
    thumbnail === "undefined"
  ) {
    return userimg;
  }

  // full image url
  if (thumbnail.startsWith("http")) {
    return thumbnail;
  }

  // remove extra slash
  const cleanPath = thumbnail.replace(/^\/+/, "");

  return `${API_BASE_URL}/${cleanPath}`;
};