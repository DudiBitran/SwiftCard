import { useEffect, useState } from "react";
import PageHeader from "../components/common/pageHeader";
import { useAuth } from "../context/auth.context";
import BusinessCard from "../components/common/businessCard";
import "../style/home.css";
import { Link } from "react-router";

function Home() {
  const { getAllCards, user } = useAuth();
  const [cards, setCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [favCards, setFavCards] = useState([]);
  const [input, setInput] = useState("");
  const [buttonEnable, setButtonEnable] = useState(false);

  useEffect(() => {
    const getCards = async () => {
      try {
        const response = await getAllCards();
        setCards(response.data);
      } catch (err) {
        throw new Error(err);
      } finally {
        setLoadingCards(false);
      }
    };
    getCards();
  }, []);

  useEffect(() => {
    if (user) {
      setButtonEnable(true);
    }
  }, [user]);

  return (
    <div className="flex-column pt-5 d-flex font-Type">
      <PageHeader
        title="Welcome To Swift Card"
        description="The best business cards in the world. Get your business card for your business and make it popular!"
      />
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
      {!user?._id && (
        <p className="align-self-center" style={{ fontSize: "1.2rem" }}>
          {" "}
          <Link to="/sign-up" style={{ textDecoration: "none" }}>
            Get Started <i className="bi bi-box-arrow-up-right"></i>
          </Link>
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
          {cards.length > 0 ? (
            <div className="d-md-none px-3">
              <div className="container">
                {cards
                  .filter((card) =>
                    card.title.toLowerCase().includes(input?.toLowerCase())
                  )
                  .map((card) => (
                    <BusinessCard
                      key={card._id}
                      setFavCards={setFavCards}
                      setCards={setCards}
                      cardDetails={card}
                      likeButton={buttonEnable}
                    />
                  ))}
              </div>
            </div>
          ) : (
            <div className="d-flex d-md-none align-self-center">
              <p>No card found.</p>
            </div>
          )}

          {cards.length > 0 ? (
            <div className="d-none d-md-flex flex-wrap justify-content-center gap-5">
              {cards
                .filter((card) =>
                  card.title.toLowerCase().includes(input?.toLowerCase())
                )
                .map((card) => (
                  <BusinessCard
                    key={card._id}
                    setFavCards={setFavCards}
                    setCards={setCards}
                    cardDetails={card}
                    likeButton={true}
                  />
                ))}
            </div>
          ) : (
            <div className="d-flex d-none d-md-flex align-self-center">
              <p>No card found.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
