import { useEffect } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
function NotFound() {
  useEffect(() => {
    toast.warning("Oops! Page not found.", {
      toastId: "not-found-toast",
    });
  }, []);

  return (
    <div className="custom-bg text-dark">
      <div className="d-flex align-items-center justify-content-center min-vh-100 px-2">
        <div className="text-center">
          <h1 className="display-1 fw-bold">404</h1>
          <p className="fs-2 fw-medium mt-4">Oops! Page not found</p>
          <p className="mt-4 mb-5">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="btn btn-primary fw-semibold rounded-pill px-4 py-2 custom-btn"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
