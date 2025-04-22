import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { Route, Routes } from "react-router";
import Home from "./pages/home";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import About from "./pages/about";
import UserUpdate from "./pages/userUpdate";
import UserDelete from "./pages/userDelete";
import CardsFavorites from "./pages/cardFavorite";
import MyCards from "./pages/myCards";
import CardUpdate from "./pages/cardUpdate";
import CardCreate from "./pages/cardCreate";
import ProtectedRoute from "./components/common/protectedRoute";
import CardView from "./pages/cardView";
import Sandbox from "./pages/adminSandbox";
import NotFound from "./pages/notFound";
import ScrollToTopButton from "./components/common/scrollUp";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <header>
        <Navbar />
      </header>

      <main
        className="flex-grow-1 d-flex flex-column"
        style={{ paddingTop: "90px" }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile/edit/:id" element={<UserUpdate />} />
          <Route path="/profile/delete-account/:id" element={<UserDelete />} />
          <Route path="/cards/my-favorite/:id" element={<CardsFavorites />} />
          <Route path="/admin/sandbox" element={<Sandbox />} />

          <Route
            path="/card/view-card-details/:cardId"
            element={<CardView />}
          />
          <Route
            path="/cards/my-cards/:id"
            element={
              <ProtectedRoute onlyBiz onlyAdmin>
                <MyCards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cards/create-card"
            element={
              <ProtectedRoute onlyBiz onlyAdmin>
                <CardCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-cards/edit/:cardId"
            element={
              <ProtectedRoute onlyBiz onlyAdmin>
                <CardUpdate />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer>
        <Footer />
      </footer>

      <ScrollToTopButton />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default App;
