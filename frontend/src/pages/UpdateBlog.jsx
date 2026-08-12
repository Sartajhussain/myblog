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

  // ================= REDUX DATA =================
  const { myBlogs } = useSelector((store) => store.blog);

  // ================= STATES =================
  const [loading, setLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // ================= AI STATES =================
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const [isPublished, setIsPublished] = useState(false);
  const [contents, setContents] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState("");

  // ================= ERROR STATES =================
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

  // ================= IMAGE URL =================
  const getImageUrl = (img) => {
    if (
      !img ||
      img === "null" ||
      img === "undefined" ||
      img === ""
    ) {
      return "https://placehold.co/400x400?text=No+Image";
    }

    if (
      img.startsWith("http://") ||
      img.startsWith("https://")
    ) {
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

  // ================= AI CONTENT GENERATION =================
  const generateAiContent = async (customPrompt = "") => {
    const promptToUse = customPrompt || aiPrompt;

    if (!blogData.title.trim()) {
      toast.error("Please enter blog title first");
      return;
    }

    if (!promptToUse.trim()) {
      toast.error("Please enter an AI prompt");
      return;
    }

    if (aiLoading) return;

    setAiLoading(true);

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/ai/generate-blog`,
        {
          prompt: promptToUse.trim(),
          title: blogData.title.trim(),
          subtitle: blogData.subtitle.trim(),
          category: blogData.category,
        },
        {
          withCredentials: true,
        }
      );

      if (data.success && data.content) {
        setContents(data.content);
        clearFieldError("description");
        toast.success("AI content generated successfully");
      } else {
        toast.error(data.message || "AI content was not generated");
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to generate AI content"
      );
    } finally {
      setAiLoading(false);
    }
  };

  // ================= VALIDATION FUNCTION =================
  const validateForm = () => {
    let isValid = true;

    const newErrors = {
      title: "",
      subtitle: "",
      category: "",
      description: "",
      thumbnail: "",
    };

    // Title validation
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

    // Subtitle validation
    if (!blogData.subtitle.trim()) {
      newErrors.subtitle = "Subtitle is required";
      isValid = false;
    } else if (blogData.subtitle.trim().length < 3) {
      newErrors.subtitle = "Subtitle must be at least 3 characters";
      isValid = false;
    }

    // Category validation
    if (!blogData.category) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    // Description validation
    if (!contents.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    } else if (contents.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
      isValid = false;
    }

    // Thumbnail validation
    const existingImage = preview && !thumbnail;

    if (!thumbnail && !existingImage) {
      newErrors.thumbnail = "Thumbnail is required";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  // ================= CLEAR FIELD ERROR =================
  const clearFieldError = (fieldName) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  // ================= FETCH BLOG =================
  useEffect(() => {
    const fetchBlog = async () => {
      const blogFromRedux = myBlogs?.find((b) => b?._id === blogId);

      if (blogFromRedux) {
        setBlogData({
          title: blogFromRedux.title || "",
          subtitle: blogFromRedux.subtitle || "",
          category: blogFromRedux.category || "",
        });

        setContents(
          blogFromRedux.description || blogFromRedux.content || ""
        );

        setIsPublished(blogFromRedux.isPublished || false);

        const image =
          blogFromRedux.thumbnail ||
          blogFromRedux.image ||
          blogFromRedux.coverImage;

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
          {
            withCredentials: true,
          }
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

          const image =
            blog.thumbnail || blog.image || blog.coverImage;

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
        toast.error(
          error.response?.data?.message || "Failed to load blog"
        );
        navigate("/dashboard/blog");
      } finally {
        setFetchLoading(false);
      }
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId, myBlogs, dispatch, navigate]);

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setBlogData({
      ...blogData,
      [e.target.name]: e.target.value,
    });

    clearFieldError(e.target.name);
  };

  // ================= CATEGORY =================
  const selectCategory = (e) => {
    setBlogData({
      ...blogData,
      category: e.target.value,
    });

    clearFieldError("category");
  };

  // ================= THUMBNAIL =================
  const thumbnailHandler = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        setErrors((prev) => ({
          ...prev,
          thumbnail: "Image size must be less than 5MB",
        }));
        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];

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

  // ================= UPDATE BLOG =================
  const blogUpdateHandler = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!blogId) {
      toast.error("Blog id is missing");
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
        return;
      }

      toast.error(data.message || "Error updating blog");
    } catch (error) {
      console.error("Update blog error:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Error updating blog"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= PUBLISH =================
  const publishHandler = async () => {
    if (publishLoading) return;

    try {
      setPublishLoading(true);

      const { data } = await axios.patch(
        `${API_BASE_URL}/api/v1/blog/${blogId}/publish`,
        {},
        {
          withCredentials: true,
        }
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

  // ================= DELETE =================
  const deleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    if (deleteLoading) return;

    try {
      setDeleteLoading(true);

      const { data } = await axios.delete(
        `${API_BASE_URL}/api/v1/blog/${blogId}`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        const updatedBlogs = (myBlogs || []).filter(
          (b) => b._id !== blogId
        );

        dispatch(setMyBlogs(updatedBlogs));
        toast.success("Blog Deleted Successfully");
        navigate("/dashboard/blog");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Error deleting blog"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // ================= LOADING STATE =================
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
    <div className="min-h-screen pt-20 pb-24 px-4 py-10 bg-gray-50 dark:bg-gray-900">
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
            className={`px-4 py-2 rounded-lg text-white transition ${isPublished
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
            className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white ${errors.title ? "border-red-500" : "border-gray-300"
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
            className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white ${errors.subtitle ? "border-red-500" : "border-gray-300"
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
            className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white ${errors.category ? "border-red-500" : "border-gray-300"
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

        {/* DESCRIPTION FIELD WITH AI ASSISTANT */}
        <div className="mb-4">

          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description <span className="text-red-500">*</span>
            </label>
          </div>

          {/* AI PROMPT TOOLBAR */}
          <div className="mb-3 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">

            <div className="flex justify-between items-center mb-2 flex-wrap gap-2">

              <label className="text-xs font-semibold text-purple-800 dark:text-purple-300 flex items-center gap-1">
                ✨ Generate Content with AI
              </label>

              {blogData.title && (
                <button
                  type="button"
                  onClick={() => {
                    if (!blogData.title.trim()) {
                      toast.error("Please enter blog title first");
                      return;
                    }

                    const autoPrompt = `
Write a complete professional blog article about:
Title: ${blogData.title}

Subtitle:
${blogData.subtitle}

Category:
${blogData.category}

Create a detailed article suitable for direct publishing.
`;

                    generateAiContent(autoPrompt);
                  }}
                  disabled={aiLoading}
                  className="text-xs text-purple-700 dark:text-purple-300 underline hover:text-purple-900 disabled:opacity-50"
                >
                  ⚡ Auto-generate using Title & Subtitle
                </button>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-2">

              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="E.g. Write a content for your blog..."
                className="flex-1 px-3 py-2 text-sm border border-purple-200 dark:border-purple-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <button
                type="button"
                onClick={() => generateAiContent()}
                disabled={aiLoading}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {aiLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <span>✨ Generate</span>
                )}
              </button>

            </div>
          </div>

          {/* JODIT EDITOR WITH INSIDE AI LOADING ANIMATION */}
          <div
            className={`relative rounded-lg overflow-hidden border ${errors.description ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              }`}
          >
            {/* IN-EDITOR PREMIUM AI WAVE / SKELETON OVERLAY */}
            {aiLoading && (
              <div className="absolute inset-0 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-6 flex flex-col justify-between animate-pulse pointer-events-none">

                {/* Header Info Banner inside Editor */}
                <div className="flex items-center justify-between border-b border-purple-200/50 dark:border-purple-800/50 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-600"></span>
                    </span>
                    <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      AI Magic is generating blog content...
                    </span>
                  </div>
                  {/* Subtle Wave Bars */}
                  <div className="flex items-end gap-1 h-4">
                    <span className="w-1 bg-purple-500 rounded-full h-full animate-bounce"></span>
                    <span className="w-1 bg-purple-400 rounded-full h-2/3 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1 bg-purple-600 rounded-full h-4/5 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>

                {/* Animated Wave Lines (Skeleton Text) */}
                <div className="space-y-4 my-auto">
                  <div className="h-4 bg-gradient-to-r from-purple-200 via-indigo-200 to-purple-200 dark:from-purple-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 rounded-full w-3/4 animate-shimmer"></div>
                  <div className="h-4 bg-gradient-to-r from-purple-200 via-indigo-200 to-purple-200 dark:from-purple-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 rounded-full w-full animate-shimmer"></div>
                  <div className="h-4 bg-gradient-to-r from-purple-200 via-indigo-200 to-purple-200 dark:from-purple-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 rounded-full w-5/6 animate-shimmer"></div>
                  <div className="h-4 bg-gradient-to-r from-purple-200 via-indigo-200 to-purple-200 dark:from-purple-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 rounded-full w-2/3 animate-shimmer"></div>
                </div>

                {/* Footer Glow Line */}
                <div className="w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent h-0.5 opacity-60"></div>
              </div>
            )}

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
            <p className="text-red-500 text-xs mt-1">
              {errors.description}
            </p>
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
            dark:file:bg-white dark:file:text-black dark:hover:file:bg-gray-100 ${errors.thumbnail ? "border-red-500" : ""
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
            <p className="text-sm font-medium mb-2 dark:text-white">Preview</p>
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