import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/auth.context";
import BusinessCard from "../components/common/businessCard";
import * as bootstrap from "bootstrap";
import { Navigate, useParams } from "react-router";
import { Link } from "react-router";
import "../style/myCards.css";

function MyCards() {
  const { id } = useParams();
  const { user, getMyCardById } = useAuth();
  const [myCards, setMyCards] = useState([]);
  const [favCards, setFavCards] = useState([]);
  const [input, setInput] = useState("");
  const buttonRef = useRef(null);

  useEffect(() => {
    const getMyCards = async () => {
      try {
        const response = await getMyCardById();
        setMyCards(response.data);
      } catch (err) {
        throw new Error(err);
      }
    };
    getMyCards();
  }, [id, user]);

  useEffect(() => {
    const popoverTriggerList = document.querySelectorAll(
      '[data-bs-toggle="popover"]'
    );
    popoverTriggerList.forEach((el) => {
      new bootstrap.Popover(el);
    });
  }, [myCards]);

  if (user?._id !== id) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <div className="pt-5 font-Type d-flex flex-column">
        {myCards.length > 0 ? (
          <>
            <div className="d-flex justify-content-center">
              <div className="my-3">
                <form role="search" className="d-flex ">
                  <input
                    className="searchControl"
                    type="search"
                    placeholder="Search..."
                    aria-label="Search"
                    onChange={(e) => setInput(e.target.value)}
                  />
                </form>
              </div>
            </div>
            <div className="d-flex textSize justify-content-center mb-4 align-items-center">
              <p className="mb-0 me-2">Do you want to create another card?</p>

              <button
                ref={buttonRef}
                type="button"
                className="btn text-primary p-0"
                data-bs-toggle="popover"
                data-bs-trigger="focus"
                data-bs-placement="right"
                title="How to create a new card?"
                data-bs-content='Please click on the profile picture and choose in the menu "Create a new card"'
              >
                <i className="bi bi-question-circle-fill"></i>
              </button>
            </div>

            <div className="d-md-none px-3">
              <div className="container">
                {myCards
                  .filter((card) =>
                    card.title.toLowerCase().includes(input.toLowerCase())
                  )
                  .map((card) => (
                    <BusinessCard
                      key={card._id}
                      cardDetails={card}
                      setMyCards={setMyCards}
                      setFavCards={setFavCards}
                      likeButton
                    />
                  ))}
              </div>
            </div>

            <div className="d-none d-md-flex flex-wrap justify-content-center gap-5">
              {myCards
                .filter((card) =>
                  card.title.toLowerCase().includes(input.toLowerCase())
                )
                .map((card) => (
                  <BusinessCard
                    key={card._id}
                    cardDetails={card}
                    setCards={setMyCards}
                    setFavCards={setFavCards}
                    likeButton
                  />
                ))}
            </div>
          </>
        ) : user?.isAdmin && !user?.isBusiness ? (
          <p className="align-self-center textSize justify-content-center">
            To create a card you must be a Business Admin.
          </p>
        ) : (
          <p className="align-self-center textSize justify-content-center">
            Create your first business card here!{" "}
            <Link to="/cards/create-card" style={{ textDecoration: "none" }}>
              Get Started <i className="bi bi-box-arrow-up-right"></i>
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default MyCards;
