import "../../style/usersTableRow.css";

function UsersRowTable({
  user: { isAdmin, isBusiness, email, name, image, _id },
  setShowModal,
  setIsUserAdmin,
  setUserId,
  setEditShowModal,
}) {
  const handleDeleteClick = () => {
    setUserId(_id);
    setShowModal(true);
    setIsUserAdmin(isAdmin);
    return;
  };

  const handleEditClick = () => {
    setUserId(_id);
    setEditShowModal(true);
  };

  return (
    <tr className="users-row">
      <td>
        <div className="d-flex align-items-center">
          <img
            src={image?.url || "../../../images/defaultImage.jpg"}
            alt={image?.alt || "Profile Img"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "../../../images/defaultImage.jpg";
            }}
            style={{ width: "45px", height: "45px" }}
            className="rounded-circle"
          />
          <div className="ms-3">
            <p className="fw-bold mb-1">
              {name.first} {name.last}
            </p>
            <p className="text-muted mb-0">{email}</p>
          </div>
        </div>
      </td>
      <td>
        {isBusiness && !isAdmin && "Business"}
        {isAdmin && isBusiness && (
          <>
            Admin
            <br />
            (business)
          </>
        )}

        {isAdmin && !isBusiness && "Admin"}
        {!isBusiness && !isAdmin && "User"}
      </td>
      <td>
        <div className="users-actions">
          <button
            type="button"
            onClick={handleDeleteClick}
            className="btn btn-link btn-sm btn-rounded"
          >
            <i
              className="bi bi-x-circle-fill fs-5"
              style={{ color: "crimson" }}
            ></i>
          </button>
          {!isAdmin && (
            <button
              type="button"
              onClick={handleEditClick}
              className="btn btn-link btn-sm btn-rounded"
            >
              <i
                className="bi bi-pencil-square fs-5"
                style={{ color: "green" }}
              ></i>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default UsersRowTable;
