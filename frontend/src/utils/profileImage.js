import userimg from "../assets/userprofile.png";
import { API_BASE_URL } from "./api";

export const getBlogImageFallback = (title = "Blog") => {
  const safeTitle = (title || "Blog").toString().trim();
  const text = safeTitle.length > 20 ? safeTitle.slice(0, 20) : safeTitle;
  return `https://placehold.co/1200x800/6366f1/white?text=${encodeURIComponent(text)}`;
};

export const getBlogImageUrl = (blog, apiBaseUrl = API_BASE_URL) => {
  const imagePath = blog?.thumbnail || blog?.image || blog?.coverImage;

  if (!imagePath || imagePath === "null" || imagePath === "undefined") {
    return getBlogImageFallback(blog?.title || "Blog");
  }

  if (typeof imagePath === "string" && imagePath.startsWith("http")) {
    return imagePath;
  }

  if (typeof imagePath === "string" && (imagePath.startsWith("/uploads") || imagePath.startsWith("uploads"))) {
    return `${apiBaseUrl}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
  }

  return getBlogImageFallback(blog?.title || "Blog");
};

export const getProfileImage = (profilePic) => {
  if (!profilePic || profilePic === "null" || profilePic === "undefined") {
    return userimg;
  }

  if (profilePic.startsWith("http")) {
    return profilePic;
  }

  return `${API_BASE_URL}/${profilePic}`;
};