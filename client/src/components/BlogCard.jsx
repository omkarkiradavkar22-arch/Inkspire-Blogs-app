import { Link } from "react-router-dom";

<Link
  to={`/blog/${blog._id}`}
  style={{ textDecoration: "none", color: "inherit" }}
>
  <div className="card p-3">
    <h3>{blog.title}</h3>
    <p>{blog.category}</p>
  </div>
</Link>