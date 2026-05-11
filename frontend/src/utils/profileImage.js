import userimg from "../assets/userprofile.png";
import { API_BASE_URL } from "./api";

export const getProfileImage = (profilePic) => {
  if (!profilePic || profilePic === "null" || profilePic === "undefined") {
    return userimg;
  }

  // full url
  if (profilePic.startsWith("http")) {
    return profilePic;
  }

  // uploaded image
  return `${API_BASE_URL}/${profilePic}`;
};