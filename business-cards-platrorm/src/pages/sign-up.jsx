import { Formik, useFormik } from "formik";
import Joi from "joi";
import PageHeader from "../components/common/pageHeader";
import Input from "../components/common/input";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../context/auth.context";
import { toast } from "react-toastify";
function SignUp() {
  const [Biz, setBizToggle] = useState(false);
  const [serverError, setServerError] = useState();
  const navigate = useNavigate();
  const { createUser, user } = useAuth();

  function changeToggle() {
    setBizToggle((Biz) => !Biz);
  }

  const generatePostObj = (json) => {
    let postObj = {};
    postObj["name"] = {
      first: json["firstName"],
      middle: json["middleName"],
      last: json["lastName"],
    };
    postObj["phone"] = json["phoneNumber"];
    postObj["email"] = json["email"];
    postObj["password"] = json["password"];
    postObj["image"] = {
      url: json["profileURL"],
      alt: json["imgAtl"],
    };
    postObj["address"] = {
      state: json["state"],
      country: json["country"],
      city: json["city"],
      street: json["street"],
      houseNumber: json["houseNumber"],
      zip: json["zip"],
    };
    postObj["isBusiness"] = Biz;
    return postObj;
  };

  const { getFieldProps, handleReset, handleSubmit, errors, touched, isValid } =
    useFormik({
      validateOnMount: true,
      initialValues: {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        passwordConfirm: "",
        country: "",
        city: "",
        street: "",
        houseNumber: "",
        zip: "",
        state: "",
        profileURL: "",
        imgAtl: "",
      },

      validate(values) {
        const schema = Joi.object({
          firstName: Joi.string()
            .min(2)
            .max(256)
            .required()
            .label("First Name"),
          middleName: Joi.string()
            .allow("")
            .optional()
            .min(2)
            .max(256)
            .label("Middle Name"),
          lastName: Joi.string().min(2).max(256).required().label("Last Name"),
          email: Joi.string()
            .email({ tlds: { allow: false } })
            .required()
            .label("Email"),
          phoneNumber: Joi.string()
            .min(9)
            .max(11)
            .pattern(/^05\d{8}$/)
            .message(
              "Invalid Israeli phone number. It must start with '05' and have 10 digits."
            )
            .required()
            .label("Phone Number"),
          password: Joi.string()
            .pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            )
            .message(
              "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
            )
            .required()
            .label("Password"),
          passwordConfirm: Joi.string()
            .valid(Joi.ref("password"))
            .messages({ "any.only": "Passwords do not match." })
            .required()
            .label("Password Confirm"),
          country: Joi.string().min(2).max(256).required().label("Country"),
          city: Joi.string().min(2).max(256).required().label("City"),
          street: Joi.string().min(2).max(256).required().label("Street"),
          houseNumber: Joi.string()
            .pattern(/^\d{1,256}$/)
            .message("House number must be a valid number.")
            .required()
            .label("House Number"),
          zip: Joi.string()
            .pattern(/^\d{5,7}$/)
            .message("Invalid Israeli ZIP code. It must be 5 or 7 digits long.")
            .required()
            .label("Zip"),
          state: Joi.string()
            .allow("")
            .optional()
            .min(2)
            .max(256)
            .label("State"),
          profileURL: Joi.string()
            .uri({ scheme: ["http", "https"] })
            .regex(/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i)
            .min(14)
            .message(
              "Invalid image URL. Must be a valid HTTP/HTTPS link ending in .jpg, .png, etc."
            )
            .optional()
            .allow("")
            .label("URL"),
          imgAtl: Joi.string()
            .min(2)
            .max(256)
            .when("profileURL", {
              is: Joi.string().min(14),
              then: Joi.required(),
              otherwise: Joi.optional().allow(""),
            })
            .label("Image Alt Text"),
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
          await createUser(objToSend);
          toast.success("Account created successfully!");
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
    <div className="container pb-5 pt-2">
      <PageHeader title={"Sign up"} description={"Hello, Sign up here!"} />
      <form
        className="row g-3"
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
      >
        {serverError && (
          <div className="alert alert-danger text-center">{serverError}</div>
        )}
        <div className="col-md-4">
          <Input
            {...getFieldProps("firstName")}
            error={touched.firstName && errors.firstName}
            label="First Name"
            placeholder="John"
            required
          />
        </div>
        <div className="col-md-4">
          <Input
            {...getFieldProps("middleName")}
            error={touched.middleName && errors.middleName}
            label="Middle name (Optional)"
            type="text"
          />
        </div>
        <div className="col-md-4">
          <Input
            {...getFieldProps("lastName")}
            error={touched.lastName && errors.lastName}
            label="Last Name"
            type="text"
            placeholder="Doe"
            required
          />
        </div>
        <div className="col-md-6">
          <Input
            {...getFieldProps("email")}
            error={touched.email && errors.email}
            label="Email"
            type="email"
            placeholder="JohnDoe@example.com"
            required
          />
        </div>
        <div className="col-md-6">
          <Input
            {...getFieldProps("phoneNumber")}
            error={touched.phoneNumber && errors.phoneNumber}
            label="Phone Number"
            type="tel"
            required
          />
        </div>
        <div className="col-md-6">
          <Input
            {...getFieldProps("password")}
            error={touched.password && errors.password}
            label="Password"
            type="password"
            required
          />
        </div>
        <div className="col-md-6">
          <Input
            {...getFieldProps("passwordConfirm")}
            error={touched.passwordConfirm && errors.passwordConfirm}
            label="Password Confirm"
            type="password"
            required
          />
        </div>
        <div className="col-md-4">
          <Input
            {...getFieldProps("country")}
            error={touched.country && errors.country}
            label="Country"
            type="text"
            required
          />
        </div>
        <div className="col-md-4">
          <Input
            {...getFieldProps("city")}
            error={touched.city && errors.city}
            label="City"
            type="text"
            required
          />
        </div>
        <div className="col-md-4">
          <Input
            {...getFieldProps("street")}
            error={touched.street && errors.street}
            label="Street"
            type="text"
            required
          />
        </div>
        <div className="col-md-4">
          <Input
            {...getFieldProps("houseNumber")}
            error={touched.houseNumber ? errors.houseNumber : ""}
            label="House Number"
            type="text"
            required
          />
        </div>
        <div className="col-md-4">
          <Input
            {...getFieldProps("zip")}
            error={touched.zip ? errors.zip : ""}
            label="Zip Code"
            type="text"
            required
          />
        </div>
        <div className="col-md-4">
          <Input
            {...getFieldProps("state")}
            error={touched.state && errors.state}
            label="State (Optional)"
            type="text"
          />
        </div>
        <div className="col-md-6">
          <Input
            {...getFieldProps("profileURL")}
            error={touched.profileURL && errors.profileURL}
            label="Profile photo image URL"
            type="text"
          />
        </div>
        <div className="col-md-6">
          <Input
            {...getFieldProps("imgAtl")}
            error={touched.imgAtl && errors.imgAtl}
            label="Image Alt Text"
            type="text"
          />
        </div>
        <div className="col-12">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
              onClick={changeToggle}
            />
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckDefault"
            >
              Sign up as a business account
            </label>
          </div>
        </div>
        <div className="col-md-3">
          <button
            disabled={!isValid}
            type="submit"
            className="btn bg-success "
            style={{ color: "#fff" }}
          >
            Sign up
          </button>
        </div>
        <div className="col-md-9">
          <button onClick={handleReset} className="btn bg-danger bg-gradient">
            Reset form
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
