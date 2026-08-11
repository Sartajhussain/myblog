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
    if (
      thumbnail.includes("res.cloudinary.com") &&
      thumbnail.includes("/upload/")
    ) {
      return thumbnail.replace(
        "/upload/",
        "/upload/f_auto,q_auto,w_800/"
      );
    }

    return thumbnail;
  }

  // remove extra slash
  const cleanPath = thumbnail.replace(/^\/+/, "");

  return `${API_BASE_URL}/${cleanPath}`;
};