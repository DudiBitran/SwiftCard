import { useFormik } from "formik";
import Joi from "joi";
import Input from "../components/common/input";
import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import Logo from "../components/Logo";
import { Link } from "react-router";
import { useAuth } from "../context/auth.context";
import "../style/sign-in.css";
import { toast } from "react-toastify";

function SignIn() {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const generatePostObj = (json) => {
    let postObj = {};
    postObj["email"] = json["email"];
    postObj["password"] = json["password"];
    return postObj;
  };

  const { getFieldProps, handleSubmit, errors, touched } = useFormik({
    validateOnMount: true,
    initialValues: {
      email: "",
      password: "",
    },

    validate(values) {
      const schema = Joi.object({
        email: Joi.string()
          .min(5)
          .required()
          .email({ tlds: false })
          .label("Email"),
        password: Joi.string()
          .pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          )
          .message(
            "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
          )
          .required()
          .label("Password"),
      });

      const { error } = schema.validate(values, {
        abortEarly: false,
      });

      if (!error) {
        return null;
      }

      const errors = {};
      for (const detail of error.details) {
        errors[detail.path[0]] = detail.message;
      }
      return errors;
    },

    onSubmit: async (values) => {
      try {
        const objToSend = generatePostObj(values);
        await login(objToSend);
        toast.success("Welcome!");
        navigate("/");
      } catch (err) {
        if (err.response?.status === 400) {
          const response = err.response.data;
          setServerError(response);
          toast.error("Something went wrong!");
        }
      }
    },
  });

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <section className="vh-100" style={{ backgroundColor: " #34495e" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src="../images/perceptual-standard.jpg"
                    alt="login form"
                    className="img-fluid"
                    style={{ borderRadius: "1rem 0 0 1rem" }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <span className="h1 fw-bold mb-0">
                          <Logo />
                        </span>
                      </div>
                      <h5
                        className="fw-normal mb-3 pb-3"
                        style={{ letterSpacing: "1px" }}
                      >
                        Sign into your account
                      </h5>
                      {serverError && (
                        <div className="alert alert-danger">{serverError}</div>
                      )}
                      <div className="form-outline mb-4">
                        <Input
                          {...getFieldProps("email")}
                          error={touched.email && errors.email}
                          label="Email"
                          type="email"
                        />
                      </div>
                      <div className="form-outline mb-4">
                        <Input
                          {...getFieldProps("password")}
                          error={touched.password && errors.password}
                          label="Password"
                          type="password"
                        />
                      </div>
                      <div className="pt-1 mb-4">
                        <button
                          className="btn btn-dark btn-lg btn-block"
                          type="submit"
                        >
                          Sign In
                        </button>
                      </div>
                      <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                        Don't have an account?{" "}
                        <Link to="/sign-up" style={{ color: "#393f81" }}>
                          Register here
                        </Link>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default SignIn;
