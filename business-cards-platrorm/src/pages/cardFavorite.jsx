import { Navigate, useParams } from "react-router";
import { useAuth } from "../context/auth.context";
import { useEffect, useState } from "react";
import BusinessCard from "../components/common/businessCard";
import PageHeader from "../components/common/pageHeader";

function CardsFavorites() {
  const [favCards, setFavCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [input, setInput] = useState("");
  const { user, getAllCards } = useAuth();
  const { id } = useParams();

  if (!user) {
    <Navigate to="/" />;
  }

  useEffect(() => {
    const getCards = async () => {
      try {
        const response = await getAllCards();
        const cards = response.data;
        const favoriteCards = cards.filter((card) => card?.likes?.includes(id));
        setFavCards(favoriteCards);
      } catch (err) {
        console.log("Error", err);
      } finally {
        setLoadingCards(false);
      }
    };
    getCards();
  }, [id, getAllCards]);

  if (user?._id !== id) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex-column pt-5 d-flex font-Type">
      <PageHeader title="My Favorite Cards" description="" />
      <div className="d-flex justify-content-center">
        <div className="my-3">
          <form role="search" className="d-flex ">
            <input
              className="searchControl my-2"
              type="search"
              placeholder="Search..."
              aria-label="Search"
              onChange={(e) => setInput(e.target.value)}
            />
          </form>
        </div>
      </div>
      {!user._id && (
        <p className="align-self-center" style={{ fontSize: "1.2rem" }}>
          {" "}
          <Link to="/sign-up">Get Started</Link>
        </p>
      )}
      {loadingCards ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          ></div>
        </div>
      ) : (
        <>
          <div className="d-md-none px-3">
            <div className="container">
              {favCards
                .filter((favCard) =>
                  favCard.title.toLowerCase().includes(input.toLowerCase())
                )
                .map((favCard) => (
                  <BusinessCard
                    key={favCard._id}
                    cardDetails={favCard}
                    setFavCards={setFavCards}
                    likeButton={true}
                  />
                ))}
            </div>
          </div>

          {favCards.length > 0 ? (
            <div className="d-none d-md-flex flex-wrap justify-content-center gap-5">
              {favCards
                .filter((favCard) =>
                  favCard.title.toLowerCase().includes(input?.toLowerCase())
                )
                .map((favCard) => (
                  <BusinessCard
                    key={favCard._id}
                    cardDetails={favCard}
                    setFavCards={setFavCards}
                    setCards={setFavCards}
                    likeButton={true}
                  />
                ))}
            </div>
          ) : (
            <div className="d-flex align-self-center">
              <p>No card found.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CardsFavorites;
