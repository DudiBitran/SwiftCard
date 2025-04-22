import React, { useEffect, useState } from "react";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { useAuth } from "../context/auth.context";
import { useNavigate, useParams } from "react-router";
import { Navigate } from "react-router";
import PageHeader from "../components/common/pageHeader";
import { toast } from "react-toastify";

function userDelete() {
  const [showModal, setShowModal] = useState(false);
  const { profileImage, userDelete, user, getUserDetails } = useAuth();
  const [userDetails, setUserDetails] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getUserDetails(id);
        setUserDetails(response.data);
      } catch (err) {
        throw new Error(err);
      }
    };

    fetchDetails();
  }, [id]);

  const handleDelete = async () => {
    setShowModal(false);
    try {
      await userDelete(id);
      toast.success("User deleted successfully!");
      return navigate("/");
    } catch (err) {
      toast.error("Something went wrong!");
      throw new Error(err);
    }
  };

  if (!user?._id) {
    return <Navigate to="/" />;
  }

  return (
    <section>
      <div className="my-5">
        <PageHeader title="Delete your account" />
      </div>
      <div className="h-100 d-flex justify-content-center align-items-center">
        <div className="row w-100 justify-content-center">
          <div className="col-12 col-sm-8 col-md-6 col-lg-4">
            <div className="card bg-secondary text-white shadow">
              <div className="card-body text-center">
                <img
                  src={profileImage?.url || "../images/defaultImage.jpg"}
                  alt="avatar"
                  className="rounded-circle img-fluid mb-3"
                  style={{ width: "70px", height: "70px" }}
                />
                <h5 className="my-2">
                  {userDetails?.name?.first} {userDetails?.name?.last}
                </h5>
                <p className="text-light mb-1">{userDetails?.email}</p>
                <p className="text-light mb-4">
                  {userDetails?.address?.city}, {userDetails?.address?.country},{" "}
                  {userDetails?.address?.state && ""}
                </p>
                <p>Created at: {userDetails?.createdAt}</p>
                <div className="d-flex justify-content-center mb-2">
                  <button
                    className="btn btn-danger"
                    onClick={() => setShowModal(true)}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ConfirmationModal
          show={showModal}
          title="Are you sure?"
          message="Do you really want to delete this account? This process cannot be undone."
          icon="bi bi-exclamation-triangle fs-1 text-danger"
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      </div>
    </section>
  );
}
export default userDelete;
