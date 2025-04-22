import PageHeader from "../components/common/pageHeader";
import { Formik, useFormik } from "formik";
import Joi from "joi";
import Input from "../components/common/input";
import { useState } from "react";
import { useAuth } from "../context/auth.context";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

function CardCreate() {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { createCard, user } = useAuth();

  const generatePostObj = (json) => {
    let postObj = {};
    postObj["title"] = json["title"];
    postObj["subtitle"] = json["subtitle"];
    postObj["description"] = json["description"];
    postObj["phone"] = json["phoneNumber"];
    postObj["email"] = json["email"];
    postObj["web"] = json["web"];
    postObj["image"] = {
      url: json["imgURL"],
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

  const { getFieldProps, handleReset, handleSubmit, errors, touched, isValid } =
    useFormik({
      validateOnMount: true,
      initialValues: {
        title: "",
        subtitle: "",
        description: "",
        phoneNumber: "",
        email: "",
        web: "",
        imgURL: "",
        imgAtl: "",
        state: "",
        country: "",
        city: "",
        street: "",
        houseNumber: "",
        zip: "",
      },

      validate(values) {
        const schema = Joi.object({
          title: Joi.string().min(2).max(256).required().label("Title"),
          subtitle: Joi.string().min(2).max(256).label("Subtitle"),
          description: Joi.string()
            .min(2)
            .max(1024)
            .required()
            .label("Description"),
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
          web: Joi.string()
            .pattern(/^$|^(https?:\/\/|www\.)[^\s/$.?#].[^\s]{13,}$/, {
              name: "valid URL",
            })
            .message({
              "string.pattern.name": `"web" must be a valid URL starting with http://, https://, or www., and at least 14 characters long`,
            })
            .optional()
            .allow("")
            .label("Web Url"),
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
          imgURL: Joi.string()
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
            .when("imgURL", {
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
          await createCard(objToSend);
          toast.success("Card created successfully!");
          navigate(`/cards/my-cards/${user._id}`);
        } catch (err) {
          if (err.response?.status === 400) {
            setServerError("Error: Email already used");
            toast.error("Something went wrong");
            throw new Error("Email already used");
          }
        }
      },
    });

  return user?.isAdmin && !user?.isBusiness ? (
    <p className="align-self-center textSize mt-5 justify-content-center">
      To create a card you must be a Business Admin.
    </p>
  ) : (
    <div className="container py-5">
      <PageHeader
        title={"Create card"}
        description={"Hello, Create your business card here!"}
      />
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
            {...getFieldProps("title")}
            error={touched.title && errors.title}
            label="Title"
            required
          />
        </div>
        <div className="col-md-4">
          <Input
            {...getFieldProps("subtitle")}
            error={touched.subtitle && errors.subtitle}
            label="Subtitle"
            type="text"
            required
          />
        </div>
        <div className="col-md-4">
          <Input
            {...getFieldProps("description")}
            error={touched.description && errors.description}
            label="Description"
            type="text"
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
        <div className="col-md-12">
          <Input
            {...getFieldProps("web")}
            error={touched.web && errors.web}
            label="Web Url"
            type="text"
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
            {...getFieldProps("imgURL")}
            error={touched.imgURL && errors.imgURL}
            label="Business image URL"
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
        <div className="col-12"></div>
        <div className="col-md-3">
          <button
            disabled={!isValid}
            type="submit"
            className="btn bg-success"
            style={{ color: "#fff" }}
          >
            Create card
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

export default CardCreate;
