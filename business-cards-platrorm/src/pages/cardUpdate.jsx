import { useFormik } from "formik";
import { useAuth } from "../context/auth.context";
import Input from "../components/common/input";
import Joi from "joi";
import PageHeader from "../components/common/pageHeader";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import isEqual from "lodash.isequal";
import { toast } from "react-toastify";

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

const makeValidate = (values) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(256).required().label("Title"),
    subtitle: Joi.string().min(2).max(256).label("Subtitle"),
    description: Joi.string().min(2).max(1024).required().label("Description"),
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

  if (!error) return null;

  const errors = {};
  for (const detail of error.details) {
    errors[detail.path[0]] = detail.message;
  }
  return errors;
};

function CardUpdate() {
  const { user, getCardById, updateCardById } = useAuth();
  const { cardId } = useParams();
  const [serverError, setServerError] = useState();
  const [cardFormValues, setCardFormValues] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getCardDetailsById = async () => {
      try {
        const response = await getCardById(cardId);
        const cardData = response.data;
        if (
          cardData.user_id !== user?._id &&
          !(user?.isAdmin && user?.isBusiness)
        ) {
          return navigate("/");
        }

        const initialValues = {
          title: cardData.title || "",
          subtitle: cardData.subtitle || "",
          description: cardData.description || "",
          phoneNumber: cardData.phone || "",
          email: cardData.email || "",
          web: cardData.web || "",
          imgURL: cardData.image?.url || "",
          imgAtl: cardData.image?.alt || "",
          state: cardData.address.state || "",
          country: cardData.address.country || "",
          city: cardData.address.city || "",
          street: cardData.address.street || "",
          houseNumber: cardData.address.houseNumber || "",
          zip: cardData.address.zip || "",
        };

        setCardFormValues(initialValues);
      } catch (err) {
        if (err.response?.status === 400) {
          setServerError(err.response.data);
        }
      }
    };

    if (cardId) {
      getCardDetailsById();
    }
  }, [cardId, user, getCardById, navigate]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: cardFormValues || {
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
    validate: makeValidate,
    validateOnMount: true,
    onSubmit: async (values) => {
      try {
        const objToSend = generatePostObj(values);
        await updateCardById(objToSend, cardId);
        toast.success("Card updated successfully!");
        navigate(`/cards/my-cards/${user._id}`);
      } catch (err) {
        if (err.response?.status === 400) {
          const response = err.response.data;
          toast.error("Something went wrong!");
          setServerError(response);
        }
      }
    },
  });

  const isFormChanged = () => {
    return !isEqual(formik.values, cardFormValues);
  };

  if (!cardFormValues) {
    return <div className="text-center mt-5">Loading user data...</div>;
  }

  return (
    <div className="container py-5">
      <PageHeader title="Card update" />
      <form
        className="row g-3"
        onSubmit={formik.handleSubmit}
        noValidate
        autoComplete="off"
      >
        {serverError && <div className="alert alert-danger">{serverError}</div>}
        <div className="col-md-4">
          <Input
            {...formik.getFieldProps("title")}
            error={formik.touched.title && formik.errors.title}
            label="Title"
            required
          />
        </div>
        <div className="col-md-4">
          <Input
            {...formik.getFieldProps("subtitle")}
            error={formik.touched.subtitle && formik.errors.subtitle}
            label="Subtitle"
            required
          />
        </div>
        <div className="col-md-4">
          <Input
            {...formik.getFieldProps("description")}
            error={formik.touched.description && formik.errors.description}
            label="Description"
            required
          />
        </div>
        <div className="col-md-6">
          <Input
            {...formik.getFieldProps("email")}
            error={formik.touched.email && formik.errors.email}
            label="Email"
            type="email"
            required
          />
        </div>
        <div className="col-md-6">
          <Input
            {...formik.getFieldProps("phoneNumber")}
            error={formik.touched.phoneNumber && formik.errors.phoneNumber}
            label="Phone Number"
            type="tel"
            required
          />
        </div>
        <div className="col-md-12">
          <Input
            {...formik.getFieldProps("web")}
            error={formik.touched.web && formik.errors.web}
            label="Web Url"
          />
        </div>
        <div className="col-md-4">
          <Input
            {...formik.getFieldProps("country")}
            error={formik.touched.country && formik.errors.country}
            label="Country"
            required
          />
        </div>
        <div className="col-md-4">
          <Input
            {...formik.getFieldProps("city")}
            error={formik.touched.city && formik.errors.city}
            label="City"
            required
          />
        </div>
        <div className="col-md-4">
          <Input
            {...formik.getFieldProps("street")}
            error={formik.touched.street && formik.errors.street}
            label="Street"
            required
          />
        </div>
        <div className="col-md-4">
          <Input
            {...formik.getFieldProps("houseNumber")}
            error={formik.touched.houseNumber && formik.errors.houseNumber}
            label="House Number"
            required
          />
        </div>
        <div className="col-md-4">
          <Input
            {...formik.getFieldProps("zip")}
            error={formik.touched.zip && formik.errors.zip}
            label="Zip Code"
            required
          />
        </div>
        <div className="col-md-4">
          <Input
            {...formik.getFieldProps("state")}
            error={formik.touched.state && formik.errors.state}
            label="State (Optional)"
          />
        </div>
        <div className="col-md-6">
          <Input
            {...formik.getFieldProps("imgURL")}
            error={formik.touched.imgURL && formik.errors.imgURL}
            label="Business image URL"
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default CardUpdate;
