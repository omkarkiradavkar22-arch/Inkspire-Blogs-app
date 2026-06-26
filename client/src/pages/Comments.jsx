import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function BlogDetails() {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const fetchBlog = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/blogs/${id}`
      );

      setBlog(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/blogs/${id}/comments`
      );

      setComments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/blogs/${id}/comment`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setText("");
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBlog();
    fetchComments();
  }, [id]);

  if (!blog) return <h2>Loading...</h2>;

  return (
    <div className="container mt-4">
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="img-fluid rounded mb-3"
        />
      )}

      <h1>{blog.title}</h1>

      <p>
        By <b>{blog.author?.username}</b>
      </p>

      <p>Category: {blog.category}</p>

      <p>{blog.content}</p>

      <hr />

      <h3>Comments</h3>

      <textarea
        className="form-control"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        className="btn btn-primary mt-2"
        onClick={handleComment}
      >
        Add Comment
      </button>

      <div className="mt-3">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="border rounded p-2 mb-2"
          >
            <strong>
              {comment.user?.username}
            </strong>

            <p className="mb-0">
              {comment.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogDetails;