// src/pages/Home.jsx
import React, { useEffect, useState, useCallback } from "react";
import API from "../api/axios";
import AIContentAssistant from "../components/AIContentAssistant";
import SmartCommentBox from "../components/SmartCommentBox";
import ContentEnhancer from "../components/ContentEnhancer";
import BlogCard from "../components/BlogCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ToastContainer from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";
import { validateBlogPost } from "../utils/validation";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: "", content: "" });
  const [editing, setEditing] = useState({}); // { [id]: { title, content } }
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const fetchBlogs = useCallback(async () => {
    try {
      const { data } = await API.get("/blogs");
      setBlogs(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Fetch user profile and blogs
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [profileRes] = await Promise.allSettled([
          API.get("/users/profile"),
          fetchBlogs()
        ]);

        if (profileRes.status === 'fulfilled') {
          setProfile(profileRes.value.data.user);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchBlogs]);

  // Create
  const handleCreate = async (e) => {
    e.preventDefault();

    // Validate input
    const validation = validateBlogPost(newBlog.title, newBlog.content);
    if (!validation.isValid) {
      setErrors({ create: validation.errors });
      toast.showError(validation.errors[0]);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      await API.post("/blogs", newBlog);
      setNewBlog({ title: "", content: "" });
      setShowAIAssistant(false);
      toast.showSuccess("Post published successfully!");
      await fetchBlogs();
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Failed to publish post. Please try again.";
      toast.showError(errorMessage);
      setErrors({ create: [errorMessage] });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;

    try {
      await API.delete(`/blogs/${id}`);
      toast.showSuccess("Post deleted successfully");
      await fetchBlogs();
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Failed to delete post. Please try again.";
      toast.showError(errorMessage);
    }
  };

  // Like/Unlike
  const handleLike = async (id) => {
    try {
      await API.post(`/blogs/${id}/like`);
      await fetchBlogs();
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Failed to update like. Please try again.";
      toast.showError(errorMessage);
    }
  };

  // Smart comment submission
  const handleSmartComment = useCallback(async (text, blogId) => {
    try {
      await API.post(`/blogs/${blogId}/comment`, { text });
      toast.showSuccess("Comment added successfully!");
      await fetchBlogs();
    } catch (error) {
      console.error('Error posting comment:', error);
      const errorMessage = error.response?.data?.message || "Failed to add comment. Please try again.";
      toast.showError(errorMessage);
    }
  }, [fetchBlogs, toast]);

  // Start Editing
  const startEdit = (blog) => {
    setEditing((e) => ({
      ...e,
      [blog._id]: { title: blog.title, content: blog.content },
    }));
  };

  // Save Edit
  const handleSaveEdit = async (id) => {
    const { title, content } = editing[id];
    await API.put(`/blogs/${id}`, { title, content });
    setEditing((e) => {
      const o = { ...e };
      delete o[id];
      return o;
    });
    fetchBlogs();
  };

  // AI Assistant handlers
  const handleTitleSuggestion = (suggestedTitle) => {
    setNewBlog((b) => ({ ...b, title: suggestedTitle }));
  };

  const handleContentSuggestion = (suggestedContent) => {
    setNewBlog((b) => ({ ...b, content: suggestedContent }));
  };

  const handleContentUpdate = (updatedContent) => {
    setNewBlog((b) => ({ ...b, content: updatedContent }));
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading DevConnect..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            DevConnect
          </h1>
          <p className="text-gray-600 text-lg">Connect, Share, and Build Together</p>
        </div>

        {profile ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {profile.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Welcome back, {profile.username}!
                </h2>
                <p className="text-gray-600">{profile.email}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">
            You’re not logged in. Please{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>{" "}
            or{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register
            </a>
            .
          </p>
        )}

        {/* Create New Blog */}
        {profile && (
          <div className="space-y-4">
            <form
              onSubmit={handleCreate}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Create New Post</h2>
                <button
                  type="button"
                  onClick={() => setShowAIAssistant(!showAIAssistant)}
                  className="flex items-center space-x-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
                >
                  <span>🤖</span>
                  <span className="text-sm">AI Assistant</span>
                </button>
              </div>

              <input
                type="text"
                placeholder="What's your post about?"
                value={newBlog.title}
                onChange={(e) =>
                  setNewBlog((b) => ({ ...b, title: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                required
                disabled={submitting}
              />
              <textarea
                placeholder="Share your thoughts, ideas, or experiences..."
                value={newBlog.content}
                onChange={(e) =>
                  setNewBlog((b) => ({ ...b, content: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="6"
                required
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={submitting || !newBlog.title.trim() || !newBlog.content.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <span>📝</span>
                    <span>Publish Post</span>
                  </>
                )}
              </button>

              {/* Error Display */}
              {errors.create && errors.create.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500">❌</span>
                    <div>
                      <p className="text-red-700 text-sm font-medium">Please fix the following errors:</p>
                      <ul className="mt-1 space-y-1">
                        {errors.create.map((error, index) => (
                          <li key={index} className="text-red-600 text-sm">• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </form>

            {/* AI Assistant */}
            {showAIAssistant && (
              <div className="space-y-4">
                <AIContentAssistant
                  title={newBlog.title}
                  content={newBlog.content}
                  onTitleSuggestion={handleTitleSuggestion}
                  onContentSuggestion={handleContentSuggestion}
                />
                <ContentEnhancer
                  content={newBlog.content}
                  onContentUpdate={handleContentUpdate}
                />
              </div>
            )}
          </div>
        )}

        {/* Blog List */}
        <div className="space-y-6">
          {blogs.map((blog) => {
            const isAuthor =
              profile && blog.author?._id === profile._id;
            const editingThis = editing[blog._id];

            return (
              <div key={blog._id} className="bg-white p-6 rounded-lg shadow">
                {/* Title & Content or Edit Form */}
                {editingThis ? (
                  <>
                    <input
                      className="w-full px-4 py-2 border rounded mb-2"
                      value={editingThis.title}
                      onChange={(e) =>
                        setEditing((ed) => ({
                          ...ed,
                          [blog._id]: {
                            ...ed[blog._id],
                            title: e.target.value,
                          },
                        }))
                      }
                    />
                    <textarea
                      className="w-full px-4 py-2 border rounded mb-2"
                      rows="3"
                      value={editingThis.content}
                      onChange={(e) =>
                        setEditing((ed) => ({
                          ...ed,
                          [blog._id]: {
                            ...ed[blog._id],
                            content: e.target.value,
                          },
                        }))
                      }
                    />
                    <button
                      onClick={() => handleSaveEdit(blog._id)}
                      className="mr-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() =>
                        setEditing((ed) => {
                          const o = { ...ed };
                          delete o[blog._id];
                          return o;
                        })
                      }
                      className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-semibold">{blog.title}</h3>
                    <p className="mt-2 text-gray-700">{blog.content}</p>
                  </>
                )}

                {/* Meta & Actions */}
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>
                    By <strong>{blog.author?.username}</strong> on{" "}
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(blog._id)}
                      className="flex items-center space-x-1 hover:text-blue-600"
                    >
                      <span>👍</span>
                      <span>{blog.likes.length}</span>
                    </button>
                    {isAuthor && !editingThis && (
                      <>
                        <button
                          onClick={() => startEdit(blog)}
                          className="text-yellow-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Comments */}
                <div className="mt-4 space-y-2">
                  {blog.comments.map((c) => (
                    <div key={c._id} className="text-sm">
                      <span className="font-semibold">
                        {c.user.username}:
                      </span>{" "}
                      {c.text}
                    </div>
                  ))}
                  {profile && (
                    <div className="mt-2">
                      <SmartCommentBox
                        blogId={blog._id}
                        onSubmit={(text) => handleSmartComment(text, blog._id)}
                        placeholder="Add comment..."
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
    </div>
  );
}
