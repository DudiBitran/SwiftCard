import { useEffect, useState } from "react";
import { useAuth } from "../context/auth.context";
import { Navigate } from "react-router";
import PageHeader from "../components/common/pageHeader";
import UsersRowTable from "../components/common/usersTableRow";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { toast } from "react-toastify";
function Sandbox() {
  const { user, getAllUsers, adminUserDelete, adminChangeStatus } = useAuth();
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState("");
  const [spinner, setSpinner] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editShowModal, setEditShowModal] = useState(false);
  const [userId, setUserId] = useState();
  const [isUserAdmin, setIsUserAdmin] = useState();

  if (user?.isAdmin === false) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data);
      } catch (err) {
        throw new Error(err);
      } finally {
        setSpinner(false);
      }
    };
    getUsers();
  }, [user?.isAdmin]);

  const handleUserDelete = async () => {
    setShowModal(false);
    if (isUserAdmin) {
      setErrorMessage("Error: Cannot delete admin account!");
      toast.error("Something went wrong!");
      throw new Error("Cannot delete admin account!");
    }
    try {
      await adminUserDelete(userId);
      toast.success("Account deleted successfully!");
      setErrorMessage("");
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (err) {
      toast.error("Something went wrong!");
      throw new Error(err);
    }
  };

  const handleChangeUserStatus = async () => {
    setEditShowModal(false);
    try {
      await adminChangeStatus(userId);
      toast.success("Status changed successfully!");
      setErrorMessage("");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isBusiness: !user.isBusiness } : user
        )
      );
    } catch (err) {
      toast.error("Something went wrong!");
      throw new Error(err);
    }
  };

  return (
    <section className="py-5">
      <div>
        <PageHeader title="SandBox" />
      </div>

      {spinner ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <img
            style={{ width: "70px" }}
            src="../../images/SvgSpinnersBlocksShuffle3.svg"
            alt="spinner"
          />
        </div>
      ) : users?.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <h5 className="text-muted">No users found.</h5>
        </div>
      ) : (
        <div>
          <div className="d-flex mt-5 justify-content-center align-items-center flex-column">
            {errorMessage && (
              <div
                className="alert alert-danger text-center"
                style={{ width: "60%" }}
              >
                {errorMessage}
              </div>
            )}
            <div className="my-3 d-flex align-items-center gap-2">
              <form role="search" className="d-flex">
                <input
                  className="searchControl"
                  type="search"
                  placeholder="Search by email..."
                  aria-label="Search"
                  onChange={(e) => setInput(e.target.value)}
                />
              </form>
            </div>
          </div>

          <div className="table-responsive container px-2">
            <table className="table align-middle container my-5 bg-white">
              <thead className="bg-light">
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                  ?.filter((user) => user.email.includes(input))
                  .map((user) => (
                    <UsersRowTable
                      key={user._id}
                      errorMessage={setErrorMessage}
                      setShowModal={setShowModal}
                      setUserId={setUserId}
                      setIsUserAdmin={setIsUserAdmin}
                      setEditShowModal={setEditShowModal}
                      user={user}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <ConfirmationModal
        show={showModal}
        message="Are you sure that you want to delete this card? This process cannot be undone."
        icon="bi bi-exclamation-triangle fs-1 text-danger"
        onConfirm={handleUserDelete}
        onCancel={() => setShowModal(false)}
      />
      <ConfirmationModal
        show={editShowModal}
        message="Are you sure that you want to change this user status?"
        icon="bi bi-exclamation-triangle fs-1 text-danger"
        onConfirm={handleChangeUserStatus}
        onCancel={() => setEditShowModal(false)}
      />
    </section>
  );
}

export default Sandbox;
