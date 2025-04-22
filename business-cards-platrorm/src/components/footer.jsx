import { useAuth } from "../context/auth.context";
import { Link } from "react-router";
import "../style/footer.css";

function Footer() {
  const { user } = useAuth();

  return (
    <div className="border-top border-dark">
      <footer style={{ backgroundColor: "#eee6d3" }}>
        <div className="container p-4">
          <div className="row">
            <div className="col-lg-6 col-md-12 mb-4">
              <h5 className="mb-3 text-dark">About</h5>
              <p>
                Swift Card lets you share your digital business card with
                anyone, anytime. Your profile is always visible — giving people
                the chance to connect, explore your details, and even show their
                appreciation by liking your card. Make every connection count.
              </p>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
              <h5 className="mb-3 text-dark">Links</h5>
              <ul className="list-unstyled mb-0">
                <li className="mb-1">
                  <Link to="/" style={{ color: "#4f4f4f" }}>
                    Home
                  </Link>
                </li>
                {user && (
                  <li className="mb-1">
                    <Link
                      to={`/cards/my-favorite/${user._id}`}
                      style={{ color: "#4f4f4f" }}
                    >
                      FAV Cards
                    </Link>
                  </li>
                )}
                {(user?.isBusiness || user?.isAdmin) && (
                  <li className="mb-1">
                    <Link
                      to={`/cards/my-cards/${user?._id}`}
                      style={{ color: "#4f4f4f" }}
                    >
                      My Cards
                    </Link>
                  </li>
                )}
                {user?.isAdmin && (
                  <li className="mb-1">
                    <Link to={`/admin/sandbox`} style={{ color: "#4f4f4f" }}>
                      SandBox
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/about" style={{ color: "#4f4f4f" }}>
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
              <h6 className="text-uppercase mb-4 font-weight-bold">
                Follow us
              </h6>

              <a
                className="btn btn-primary btn-floating m-1"
                style={{ backgroundColor: "#3b5998", border: "none" }}
                href="#!"
                role="button"
              >
                <i className="bi bi-facebook"></i>
              </a>

              <a
                className="btn btn-primary btn-floating m-1"
                style={{ backgroundColor: "#55acee", border: "none" }}
                href="#!"
                role="button"
              >
                <i className="bi bi-twitter"></i>
              </a>

              <a
                className="btn btn-primary btn-floating m-1"
                style={{ backgroundColor: "#dd4b39", border: "none" }}
                href="#!"
                role="button"
              >
                <i className="bi bi-google"></i>
              </a>

              <a
                className="btn btn-primary btn-floating m-1"
                style={{ backgroundColor: "#ac2bac", border: "none" }}
                href="#!"
                role="button"
              >
                <i className="bi bi-instagram"></i>
              </a>

              <a
                className="btn btn-primary btn-floating m-1"
                style={{ backgroundColor: "#0082ca", border: "none" }}
                href="#!"
                role="button"
              >
                <i className="bi bi-linkedin"></i>
              </a>

              <a
                className="btn btn-primary btn-floating m-1"
                style={{ backgroundColor: "#333333", border: "none" }}
                href="#!"
                role="button"
              >
                <i className="bi bi-github"></i>
              </a>
            </div>
          </div>
        </div>

        <div
          className="text-center p-3"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        >
          © {new Date().getFullYear()} Copyright:{" "}
          <span className="text-dark">
            Swift{" "}
            <img
              style={{ width: "25px" }}
              src="/images/bussinesFavicon.png"
              alt="Brand Icon"
            />
            <span> Card</span>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
