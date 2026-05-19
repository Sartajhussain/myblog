import React, { useRef, useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import { API_BASE_URL } from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const UpdateBlog = () => {
  const { blog } = useSelector((store) => store.blog);
  const navigate = useNavigate();
  const { blogId } = useParams();
  const dispatch = useDispatch();
  const editor = useRef(null);

  // ✅ REDUX DATA
  const { myBlogs } = useSelector((store) => store.blog);

  // ✅ FIND BLOG
  const selectedBlog = myBlogs?.find((b) => b?._id === blogId);

  /* ================= STATES ================= */
  const [loading, setLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isPublished, setIsPublished] = useState(false);
  const [contents, setContents] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState("");

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

  /* ================= LOAD BLOG ================= */
  useEffect(() => {
    if (selectedBlog) {
      setBlogData({
        title: selectedBlog.title || "",
        subtitle: selectedBlog.subtitle || "",
        category: selectedBlog.category || "",
      });

      // ✅ DESCRIPTION
      setContents(
        selectedBlog.description ||
          selectedBlog.content ||
          ""
      );

      setIsPublished(selectedBlog.isPublished || false);

      // ✅ IMAGE PREVIEW
      const image =
        selectedBlog.thumbnail ||
        selectedBlog.image ||
        selectedBlog.coverImage;

      if (image) {
        setPreview(getImageUrl(image));
      }
    }
  }, [selectedBlog]);

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    setBlogData({
      ...blogData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= CATEGORY ================= */
  const selectCategory = (e) => {
    setBlogData({
      ...blogData,
      category: e.target.value,
    });
  };

  /* ================= THUMBNAIL ================= */
  const thumbnailHandler = (e) => {
    const file = e.target.files[0];

    if (file) {
      setThumbnail(file);

      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  /* ================= UPDATE BLOG ================= */
  const blogUpdateHandler = async () => {
    if (loading) return;

    // ✅ VALIDATION
    if (!blogData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!blogData.subtitle.trim()) {
      toast.error("Subtitle is required");
      return;
    }

    if (!blogData.category) {
      toast.error("Category is required");
      return;
    }

    if (!contents.trim()) {
      toast.error("Description is required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", blogData.title);
      formData.append("subtitle", blogData.subtitle);
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
        // ✅ UPDATE REDUX
        const updatedBlogs = myBlogs.map((b) =>
          b._id === blogId ? data.blog : b
        );

        dispatch(setMyBlogs(updatedBlogs));

        toast.success("Blog Updated Successfully");

        navigate("/dashboard/blog");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Error updating blog"
      );
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

        // ✅ UPDATE REDUX
        const updatedBlogs = myBlogs.map((b) =>
          b._id === blogId ? data.blog : b
        );

        dispatch(setMyBlogs(updatedBlogs));

        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Error"
      );
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
        // ✅ REMOVE FROM REDUX
        const updatedBlogs = myBlogs.filter(
          (b) => b._id !== blogId
        );

        dispatch(setMyBlogs(updatedBlogs));

        toast.success("Blog Deleted Successfully");

        navigate("/dashboard/blog");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Error deleting blog"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 md:ml-72 px-4 py-10 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-10">
        
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Update Blog
        </h1>

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

        {/* TITLE */}
        <input
          type="text"
          name="title"
          value={blogData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full mb-4 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        {/* SUBTITLE */}
        <input
          type="text"
          name="subtitle"
          value={blogData.subtitle}
          onChange={handleChange}
          placeholder="Subtitle"
          className="w-full mb-4 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        {/* CATEGORY */}
        <select
          value={blogData.category}
          onChange={selectCategory}
          className="w-full mb-4 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">Select Category</option>
          <option value="tech">Technology</option>
          <option value="business">Business</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="education">Education</option>
        </select>

        {/* EDITOR */}
        <div className="mb-4">
          <JoditEditor
            ref={editor}
            value={contents}
            onChange={(newContent) => setContents(newContent)}
          />
        </div>

        {/* IMAGE INPUT */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Blog Thumbnail
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={thumbnailHandler}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-black file:text-white
            hover:file:bg-gray-800
            dark:file:bg-white dark:file:text-black"
          />
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
                e.target.src =
                  "https://placehold.co/400x400?text=No+Image";
              }}
            />
          </div>
        )}

        {/* SAVE BUTTON */}
        <button
          onClick={blogUpdateHandler}
          disabled={loading}
          className="mt-6 px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-900 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default UpdateBlog;