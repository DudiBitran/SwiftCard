import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import "../../style/businessCard.css";
import { useAuth } from "../../context/auth.context";
import ConfirmationModal from "./ConfirmationModal";
import BizNumberInputModal from "./inputModal";
import { toast } from "react-toastify";

function BusinessCard({
  cardDetails: {
    title,
    subtitle,
    address,
    description,
    image,
    phone,
    bizNumber,
    _id,
    likes,
    user_id,
  },

  setCards,
  setFavCards,
  likeButton,
}) {
  const [showModal, setShowModal] = useState(false);
  const [showBizModal, setShowBizModal] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [likesCounter, setLikesCounter] = useState();
  const [UpdatedBizNumber, setUpdatedBizNumber] = useState(bizNumber || "");
  const { likeAndUnlike, user, deleteCard, updateBizNumber } = useAuth();
  const location = useLocation();
  const handleLikeChange = async () => {
    try {
      await likeAndUnlike(_id);
      setFavCards((prevCards) => prevCards.filter((card) => card._id !== _id));
      setIsLike((isLike) => !isLike);
    } catch (err) {
      console.log("Error", err);
    }
  };

  const handleDeleteCard = async () => {
    setShowModal(false);
    if (user?._id !== user_id && !user?.isAdmin) {
      return;
    }
    try {
      await deleteCard(_id);
      toast.success("Card deleted successfully!");
      setCards((prevCards) => prevCards.filter((card) => card._id !== _id));
    } catch (err) {
      toast.error("Something went wrong!");
      console.log("Error", err);
    }
  };

  const handleBizNumberUpdate = async (value) => {
    setShowBizModal(false);
    try {
      await updateBizNumber(value, _id);
      toast.success("bizNumber updated successfully!");
    } catch (err) {
      toast.error("Something went wrong!");
      throw new Error(err);
    }
  };

  useEffect(() => {
    if (likes && user) {
      const liked = likes.includes(user._id);
      setIsLike(liked);
    }
  }, [likes, user]);

  useEffect(() => {
    setLikesCounter(likes.length);
  }, [likes, user]);

  const formattedAddress = address
    ? `${address.street} ${address.houseNumber}, ${address.city}`
    : "No address provided";

  return (
    <div className="font-type col-sm-6 col-md-4 col-xl-3 mb-4">
      <div className="card h-100 shadow business-card">
        <img
          src={image?.url || "/images/bussinesFavicon.png"}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/bussinesFavicon.png";
          }}
          className="card-img-top"
          alt={image?.alt}
          style={{ height: "200px", objectFit: "cover" }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-primary">{title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{subtitle}</h6>
          <p className="card-text small">{description || "No description"}</p>
          <ul className="list-unstyled small mb-3">
            <li>
              <strong>
                <i className="bi bi-shop fs-5 me-1"></i>
              </strong>
              {formattedAddress}
            </li>
            <li>
              <strong>
                <i className="bi bi-telephone-fill fs-5 me-1"></i>
              </strong>
              {phone || "N/A"}
            </li>
            <li>BizNumber: {UpdatedBizNumber || "N/A"}</li>
          </ul>
        </div>

        <div
          className="card-footer d-flex justify-content-around align-items-center"
          style={{ background: "#999" }}
        >
          <div className="d-flex align-items-center gap-3">
            <Link
              to={`/card/view-card-details/${_id}`}
              state={{ from: location.pathname }}
            >
              <i
                className="bi bi-eye"
                style={{ fontSize: "1.3rem", color: "green" }}
              ></i>
            </Link>
            {(user?._id === user_id || (user?.isAdmin && user?.isBusiness)) && (
              <div>
                <Link to={`/my-cards/edit/${_id}`}>
                  <i
                    className="bi bi-pencil-square"
                    style={{ fontSize: "1.3rem", color: "blue" }}
                  ></i>
                </Link>
              </div>
            )}
            <div>
              {!(user?._id !== user_id && !user?.isAdmin) && (
                <button
                  onClick={() => setShowModal(true)}
                  style={{ background: "none", border: "0" }}
                >
                  <i
                    className="bi bi-trash3"
                    style={{
                      fontSize: "1.3rem",

                      color: "crimson",
                    }}
                  ></i>
                </button>
              )}
            </div>
          </div>
          {user?.isAdmin && (
            <div>
              <button
                className="btn btn-primary btn-sm btn-md"
                onClick={() => {
                  setShowBizModal(true);
                }}
              >
                BizNumber
              </button>
            </div>
          )}

          <div className="d-flex align-items-center gap-1">
            {user?._id && likeButton && (
              <button
                type="submit"
                onClick={() => handleLikeChange(_id)}
                className="border-0"
                style={{ background: "none" }}
              >
                {!isLike ? (
                  <i
                    className="bi bi-heart"
                    onClick={() => {
                      setLikesCounter((likesCounter) => likesCounter + 1);
                    }}
                  ></i>
                ) : (
                  <i
                    className="bi bi-heart-fill text-danger"
                    onClick={() => {
                      setLikesCounter((likesCounter) => likesCounter - 1);
                    }}
                  ></i>
                )}
              </button>
            )}
            {user && <div>{likesCounter}</div>}
          </div>
        </div>
      </div>
      <ConfirmationModal
        show={showModal}
        message="Are you sure that you want to delete this card? This process cannot be undone."
        icon="bi bi-exclamation-triangle fs-1 text-danger"
        onConfirm={handleDeleteCard}
        onCancel={() => setShowModal(false)}
      />
      <BizNumberInputModal
        show={showBizModal}
        onCancel={() => setShowBizModal(false)}
        onConfirm={handleBizNumberUpdate}
        bizNumberFromCard={bizNumber}
        setUpdatedBizNumber={setUpdatedBizNumber}
        icon="bi bi-building"
        title="Update Business Number"
        message="Enter the new 7-digit business number."
      />
    </div>
  );
}

export default BusinessCard;
