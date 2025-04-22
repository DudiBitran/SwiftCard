import { useAuth } from "../context/auth.context";
import { useFormik } from "formik";
import Input from "../components/common/input";
import Joi from "joi";
import PageHeader from "../components/common/pageHeader";
import { Navigate, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import isEqual from "lodash.isequal";
import { toast } from "react-toastify";

const generatePostObj = (json) => {
  let postObj = {};
  postObj["name"] = {
    first: json["firstName"],
    middle: json["middleName"],
    last: json["lastName"],
  };
  postObj["phone"] = json["phoneNumber"];
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
  return postObj;
};

const makeValidate = (values) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(256).required().label("First Name"),
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
      .pattern(/^05\d{8}$/)
      .message(
        "Invalid Israeli phone number. Must start with '05' and have 10 digits."
      )
      .required()
      .label("Phone Number"),
    country: Joi.string().min(2).max(256).required().label("Country"),
    city: Joi.string().min(2).max(256).required().label("City"),
    street: Joi.string().min(2).max(256).required().label("Street"),
    houseNumber: Joi.alternatives()
      .try(Joi.string().pattern(/^\d{1,256}$/), Joi.number().integer().min(0))
      .required()
      .label("House Number"),
    zip: Joi.alternatives()
      .try(
        Joi.string().pattern(/^\d{5,7}$/),
        Joi.number().integer().min(10000).max(9999999)
      )
      .required()
      .label("ZIP Code"),
    state: Joi.string().allow("").optional().min(2).max(256).label("State"),
    profileURL: Joi.string()
      .uri({ scheme: ["http", "https"] })
      .regex(/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i)
      .allow("")
      .label("Profile Photo URL"),
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

  const { error } = schema.validate(values, { abortEarly: false });
  if (!error) return null;

  const errors = {};
  for (const detail of error.details) {
    errors[detail.path[0]] = detail.message;
  }
  return errors;
};

function UserUpdate() {
  const { user, userUpdate, getUserDetails } = useAuth();
  const { id } = useParams();
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const [userFormValues, setUserFormValues] = useState(null);

  useEffect(() => {
    const getUserDetailsById = async () => {
      try {
        const response = await getUserDetails(user._id);
        const userData = response.data;
        const initialValues = {
          firstName: userData.name.first || "",
          middleName: userData.name.middle || "",
          lastName: userData.name.last || "",
          email: userData.email || "",
          phoneNumber: userData.phone || "",
          country: userData.address.country || "",
          city: userData.address.city || "",
          street: userData.address.street || "",
          houseNumber: userData.address.houseNumber || "",
          zip: userData.address.zip || "",
          state: userData.address.state || "",
          profileURL: userData.image?.url || "",
          imgAtl: userData.image?.alt || "",
        };

        setUserFormValues(initialValues);
      } catch (err) {
        if (err.response?.status === 400) {
          setServerError(err.response.data);
        }
      }
    };

    if (user?._id) {
      getUserDetailsById();
    }
  }, [user?._id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: userFormValues || {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      country: "",
      city: "",
      street: "",
      houseNumber: "",
      zip: "",
      state: "",
      profileURL: "",
      imgAtl: "",
    },
    validate: makeValidate,
    validateOnMount: true,
    onSubmit: async (values) => {
      try {
        const objToSend = generatePostObj(values);
        await userUpdate(objToSend, id);
        toast.success("User details updated successfully!");
        navigate("/");
      } catch (err) {
        if (err.response?.status === 400) {
          setServerError(err.response.data);
          toast.error("Something went wrong!");
        }
      }
    },
  });

  const isFormChanged = () => {
    return !isEqual(formik.values, userFormValues);
  };

  if (!user?._id || user._id !== id) {
    return <Navigate to="/" />;
  }

  if (!userFormValues) {
    return <div className="text-center mt-5">Loading user data...</div>;
  }

  return (
    <div className="container pb-5 mt-3 pt-2">
      <PageHeader title="Edit Profile" />
      <form
        className="row g-3"
        onSubmit={formik.handleSubmit}
        noValidate
        autoComplete="off"
      >
        {serverError && <div className="alert alert-danger">{serverError}</div>}

        <div className="col-md-4">
          <Input
            {...formik.getFieldProps("firstName")}
            error={formik.touched.firstName && formik.errors.firstName}
            label="First Name"
          />
        </div>
        <div className="col-md-4">
          <Input
            {...formik.getFieldProps("middleName")}
            error={formik.touched.middleName && formik.errors.middleName}
            label="Middle Name"
          />
        </div>
        <div className="col-md-4">
          <Input
            {...formik.getFieldProps("lastName")}
            error={formik.touched.lastName && formik.errors.lastName}
            label="Last Name"
          />
        </div>
        <div className="col-md-6">
          <Input
            {...formik.getFieldProps("phoneNumber")}
            error={formik.touched.phoneNumber && formik.errors.phoneNumber}
            label="Phone Number"
          />
        </div>
        <div className="col-md-6">
          <Input
            {...formik.getFieldProps("country")}
            error={formik.touched.country && formik.errors.country}
            label="Country"
          />
        </div>
        <div className="col-md-4">
          <Input
            {...formik.getFieldProps("city")}
            error={formik.touched.city && formik.errors.city}
            label="City"
          />
        </div>
        <div className="col-md-4">
          <Input
            {...formik.getFieldProps("street")}
            error={formik.touched.street && formik.errors.street}
            label="Street"
          />
        </div>
        <div className="col-md-4">
          <Input
            {...formik.getFieldProps("houseNumber")}
            error={formik.touched.houseNumber && formik.errors.houseNumber}
            label="House Number"
            type="text"
          />
        </div>
        <div className="col-md-6">
          <Input
            {...formik.getFieldProps("zip")}
            error={formik.touched.zip && formik.errors.zip}
            label="Zip Code"
          />
        </div>
        <div className="col-md-6">
          <Input
            {...formik.getFieldProps("state")}
            error={formik.touched.state && formik.errors.state}
            label="State"
          />
        </div>
        <div className="col-md-6">
          <Input
            {...formik.getFieldProps("profileURL")}
            error={formik.touched.profileURL && formik.errors.profileURL}
            label="Profile Photo URL"
          />
        </div>
        <div className="col-md-6">
          <Input
            {...formik.getFieldProps("imgAtl")}
            error={formik.touched.imgAtl && formik.errors.imgAtl}
            label="Image Alt Text"
          />
        </div>
        <div className="col-md-3">
          <button
            disabled={!formik.isValid || !isFormChanged()}
            type="submit"
            className="btn bg-success"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserUpdate;
