import React, { useRef, useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import { API_BASE_URL } from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { setMyBlogs } from "../redux/blogSlice";

const UpdateBlog = () => {
  const navigate = useNavigate();
  const { blogId } = useParams();
  const dispatch = useDispatch();
  const editor = useRef(null);

  // ✅ REDUX DATA
  const { myBlogs } = useSelector((store) => store.blog);

  /* ================= STATES ================= */
  const [loading, setLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [isPublished, setIsPublished] = useState(false);
  const [contents, setContents] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState("");

  // ✅ ERROR STATES
  const [errors, setErrors] = useState({
    title: "",
    subtitle: "",
    category: "",
    description: "",
    thumbnail: "",
  });

  const [blogData, setBlogData] = useState({
    title: "",
    subtitle: "",
    category: "",
  });

  /* ================= IMAGE URL ================= */
  const getImageUrl = (img) => {
    if (!img || img === "null" || img === "undefined" || img === "") {
      return "https://placehold.co/400x400?text=No+Image";
    }

    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }

    if (img.startsWith("/uploads")) {
      return `${API_BASE_URL}${img}`;
    }

    if (img.startsWith("uploads")) {
      return `${API_BASE_URL}/${img}`;
    }

    return `${API_BASE_URL}/${img.replace(/^\/+/, "")}`;
  };

  /* ================= VALIDATION FUNCTION ================= */
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      title: "",
      subtitle: "",
      category: "",
      description: "",
      thumbnail: "",
    };

    // ✅ Title validation
    if (!blogData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    } else if (blogData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
      isValid = false;
    } else if (blogData.title.trim().length > 100) {
      newErrors.title = "Title must be less than 100 characters";
      isValid = false;
    }

    // ✅ Subtitle validation
    if (!blogData.subtitle.trim()) {
      newErrors.subtitle = "Subtitle is required";
      isValid = false;
    } else if (blogData.subtitle.trim().length < 3) {
      newErrors.subtitle = "Subtitle must be at least 3 characters";
      isValid = false;
    }

    // ✅ Category validation
    if (!blogData.category) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    // ✅ Description validation
    if (!contents.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    } else if (contents.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
      isValid = false;
    }

    // ✅ Thumbnail validation (only if new thumbnail is selected OR no existing thumbnail)
    const existingImage = preview && !thumbnail;
    if (!thumbnail && !existingImage) {
      newErrors.thumbnail = "Thumbnail is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /* ================= CLEAR FIELD ERROR ================= */
  const clearFieldError = (fieldName) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  /* ================= FETCH BLOG ================= */
  useEffect(() => {
    const fetchBlog = async () => {
      const blogFromRedux = myBlogs?.find((b) => b?._id === blogId);
      
      if (blogFromRedux) {
        setBlogData({
          title: blogFromRedux.title || "",
          subtitle: blogFromRedux.subtitle || "",
          category: blogFromRedux.category || "",
        });

        setContents(blogFromRedux.description || blogFromRedux.content || "");
        setIsPublished(blogFromRedux.isPublished || false);

        const image = blogFromRedux.thumbnail || blogFromRedux.image || blogFromRedux.coverImage;
        if (image) {
          setPreview(getImageUrl(image));
        }
        setFetchLoading(false);
        return;
      }

      try {
        setFetchLoading(true);
        const { data } = await axios.get(
          `${API_BASE_URL}/api/v1/blog/${blogId}`,
          { withCredentials: true }
        );

        if (data.success && data.blog) {
          const blog = data.blog;
          
          setBlogData({
            title: blog.title || "",
            subtitle: blog.subtitle || "",
            category: blog.category || "",
          });

          setContents(blog.description || blog.content || "");
          setIsPublished(blog.isPublished || false);

          const image = blog.thumbnail || blog.image || blog.coverImage;
          if (image) {
            setPreview(getImageUrl(image));
          }

          if (myBlogs) {
            dispatch(setMyBlogs([...myBlogs, blog]));
          }
        } else {
          toast.error("Blog not found");
          navigate("/dashboard/blog");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error(error.response?.data?.message || "Failed to load blog");
        navigate("/dashboard/blog");
      } finally {
        setFetchLoading(false);
      }
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId, myBlogs, dispatch, navigate]);

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    setBlogData({
      ...blogData,
      [e.target.name]: e.target.value,
    });
    clearFieldError(e.target.name);
  };

  /* ================= CATEGORY ================= */
  const selectCategory = (e) => {
    setBlogData({
      ...blogData,
      category: e.target.value,
    });
    clearFieldError("category");
  };

  /* ================= THUMBNAIL ================= */
  const thumbnailHandler = (e) => {
    const file = e.target.files[0];

    if (file) {
      // ✅ File size validation (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        setErrors((prev) => ({
          ...prev,
          thumbnail: "Image size must be less than 5MB",
        }));
        return;
      }

      // ✅ File type validation
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPEG, PNG, WEBP images are allowed");
        setErrors((prev) => ({
          ...prev,
          thumbnail: "Only JPEG, PNG, WEBP images are allowed",
        }));
        return;
      }

      setThumbnail(file);
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      clearFieldError("thumbnail");
    }
  };

  /* ================= UPDATE BLOG ================= */
  const blogUpdateHandler = async () => {
    // ✅ Validate all fields
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", blogData.title.trim());
      formData.append("subtitle", blogData.subtitle.trim());
      formData.append("category", blogData.category);
      formData.append("description", contents);

      if (thumbnail) {
        formData.append("file", thumbnail);
      }

      const { data } = await axios.put(
        `${API_BASE_URL}/api/v1/blog/${blogId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        const updatedBlogs = (myBlogs || []).map((b) =>
          b._id === blogId ? data.blog : b
        );

        dispatch(setMyBlogs(updatedBlogs));

        toast.success("Blog Updated Successfully");
        navigate("/dashboard/blog");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error updating blog");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PUBLISH ================= */
  const publishHandler = async () => {
    if (publishLoading) return;

    try {
      setPublishLoading(true);

      const { data } = await axios.patch(
        `${API_BASE_URL}/api/v1/blog/${blogId}/publish`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        setIsPublished(data.blog.isPublished);

        const updatedBlogs = (myBlogs || []).map((b) =>
          b._id === blogId ? data.blog : b
        );
        dispatch(setMyBlogs(updatedBlogs));

        if (window.refreshHomeBlogs) {
          window.refreshHomeBlogs();
        }

        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setPublishLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const deleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    if (deleteLoading) return;

    try {
      setDeleteLoading(true);

      const { data } = await axios.delete(
        `${API_BASE_URL}/api/v1/blog/${blogId}`,
        { withCredentials: true }
      );

      if (data.success) {
        const updatedBlogs = (myBlogs || []).filter((b) => b._id !== blogId);
        dispatch(setMyBlogs(updatedBlogs));

        toast.success("Blog Deleted Successfully");
        navigate("/dashboard/blog");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error deleting blog");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ✅ LOADING STATE
  if (fetchLoading) {
    return (
      <div className="min-h-screen pt-20 pb-24 md:ml-72 px-4 py-10 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-10">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24 md:ml-72 px-4 py-10 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-10">
        
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Update Blog
        </h1>

        {/* REQUIRED FIELDS NOTE */}
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            ⚠️ All fields are required (*)
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            onClick={publishHandler}
            disabled={publishLoading}
            className={`px-4 py-2 rounded-lg text-white transition ${
              isPublished
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-green-600 hover:bg-green-700"
            } disabled:opacity-50`}
          >
            {publishLoading
              ? "Processing..."
              : isPublished
              ? "Unpublish"
              : "Publish"}
          </button>

          <button
            onClick={deleteHandler}
            disabled={deleteLoading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 transition"
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </button>
        </div>

        {/* TITLE FIELD */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={blogData.title}
            onChange={handleChange}
            placeholder="Enter blog title"
            className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        {/* SUBTITLE FIELD */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subtitle <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="subtitle"
            value={blogData.subtitle}
            onChange={handleChange}
            placeholder="Enter blog subtitle"
            className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white ${
              errors.subtitle ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.subtitle && (
            <p className="text-red-500 text-xs mt-1">{errors.subtitle}</p>
          )}
        </div>

        {/* CATEGORY FIELD */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={blogData.category}
            onChange={selectCategory}
            className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white ${
              errors.category ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Category</option>
            <option value="tech">Technology</option>
            <option value="business">Business</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="education">Education</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category}</p>
          )}
        </div>

        {/* DESCRIPTION FIELD */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <div className={`border rounded-lg ${errors.description ? "border-red-500" : "border-gray-300"}`}>
            <JoditEditor
              ref={editor}
              value={contents}
              onChange={(newContent) => {
                setContents(newContent);
                if (newContent.trim()) {
                  clearFieldError("description");
                }
              }}
            />
          </div>
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
          {contents.trim().length > 0 && contents.trim().length < 50 && (
            <p className="text-yellow-500 text-xs mt-1">
              ⚠️ Minimum 50 characters required (currently {contents.trim().length})
            </p>
          )}
        </div>

        {/* THUMBNAIL FIELD */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Blog Thumbnail <span className="text-red-500">*</span>
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={thumbnailHandler}
            className={`block w-full text-sm text-gray-500 dark:text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-black file:text-white
            hover:file:bg-gray-800
            dark:file:bg-white dark:file:text-black dark:hover:file:bg-gray-100 ${
              errors.thumbnail ? "border-red-500" : ""
            }`}
          />
          {errors.thumbnail && (
            <p className="text-red-500 text-xs mt-1">{errors.thumbnail}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Allowed: JPEG, PNG, WEBP (Max 5MB)
          </p>
        </div>

        {/* IMAGE PREVIEW */}
        {preview && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2 dark:text-white">
              Preview
            </p>
            <img
              src={preview}
              alt="preview"
              className="w-40 h-40 object-cover rounded-lg border"
              onError={(e) => {
                e.target.src = "https://placehold.co/400x400?text=No+Image";
              }}
            />
          </div>
        )}

        {/* SAVE BUTTON */}
        <button
          onClick={blogUpdateHandler}
          disabled={loading}
          className="mt-6 px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-900 transition disabled:opacity-50 w-full md:w-auto"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default UpdateBlog;