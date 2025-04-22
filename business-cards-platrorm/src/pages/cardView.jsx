import { Link, useParams, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/auth.context";
import { useEffect, useState } from "react";
import "../style/cardView.css";

function CardView() {
  const { cardId } = useParams();
  const { getCardById } = useAuth();
  const [card, setCard] = useState();

  useEffect(() => {
    const getCard = async () => {
      try {
        const response = await getCardById(cardId);
        setCard(response.data);
      } catch (err) {
        throw new Error(err);
      }
    };

    getCard();
  }, [cardId]);

  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from || "/";

  const handleBack = () => {
    navigate(from);
  };

  const formattedAddress = card?.address
    ? `${card?.address.street} ${card?.address.houseNumber}, ${card?.address.city}`
    : "No address provided";
  return (
    <section className="v-100 gradient-form" style={{ background: "#A7B49E" }}>
      <div
        className="container flex-fill h-100 w-100"
        style={{ padding: "100px 0" }}
      >
        <button
          onClick={handleBack}
          style={{ textDecoration: "none", border: "0", background: "none" }}
        >
          <div className="d-flex align-items-center gap-1 text-dark">
            <div>
              <i className="bi bi-arrow-left font-type"></i>
            </div>
            <div className="font-type" style={{ fontSize: "1.2rem" }}>
              Back
            </div>
          </div>
        </button>
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-xl-10">
            <div className="card rounded-3 text-black shadow">
              <div className="row g-0">
                <div className="col-lg-6">
                  <div className="card-body p-md-5 mx-md-4">
                    <div className="text-center mb-5">
                      <h4 className="mt-1 pb-1">{card?.title}</h4>
                      <h5>{card?.subtitle}</h5>
                    </div>
                    <p>Address: {formattedAddress}</p>
                    <p>Email: {card?.email}</p>
                    <p>Phone: {card?.phone}</p>
                    <p>Card Number: {card?.bizNumber}</p>
                    <div
                      className="d-flex btn-background justify-content-center align-items-center gap-1"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "10px",
                        background: "#A7B49E",
                      }}
                    >
                      <div>
                        <i className="bi bi-heart-fill text-danger"></i>
                      </div>
                      <div>{card?.likes.length}</div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 d-flex align-items-center">
                  <img
                    src={
                      card?.image?.url ||
                      "../../images/digital business card.png"
                    }
                    alt={card?.image?.alt}
                    className="img-fluid w-100 rounded-end"
                    style={{ objectFit: "cover", height: "100%" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "../../images/digital business card.png";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CardView;
