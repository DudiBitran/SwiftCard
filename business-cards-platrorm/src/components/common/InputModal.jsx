import { useState } from "react";
import Joi from "joi";

const BizNumberInputModal = ({
  show,
  onCancel,
  onConfirm,
  icon,
  title,
  message,
  bizNumberFromCard,
  setUpdatedBizNumber,
}) => {
  const [bizNumber, setBizNumber] = useState(bizNumberFromCard);
  const [error, setError] = useState("");

  const validate = (value) => {
    const schema = Joi.string()
      .pattern(/^\d{7}$/)
      .required()
      .messages({
        "string.pattern.base": "Business number must be exactly 7 digits",
        "string.empty": "Business number is required",
      });

    const { error } = schema.validate(value);
    return error ? error.message : "";
  };

  const handleConfirm = () => {
    const validationError = validate(bizNumber);
    if (validationError) {
      setError(validationError);
    } else {
      setError("");
      onConfirm({ bizNumber });
      setUpdatedBizNumber(bizNumber);
      setBizNumber(bizNumber);
    }
  };

  return (
    <div
      className={`modal fade ${show ? "show d-block" : "d-none"}`}
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div
          className="modal-content d-flex flex-row"
          style={{ minHeight: "250px" }}
        >
          <div
            className="d-flex flex-column align-items-stretch"
            style={{ width: "120px", flexShrink: 0 }}
          >
            <div style={{ height: "6px", backgroundColor: "red" }}></div>
            <div
              className="d-flex justify-content-center align-items-center p-3 flex-grow-1"
              style={{
                backgroundColor: "#f8f9fa",
                borderRight: "1px solid #dee2e6",
              }}
            >
              <i className={icon}></i>
            </div>
          </div>

          <div className="flex-grow-1 d-flex flex-column">
            <div style={{ height: "6px", backgroundColor: "red" }}></div>
            <div className="modal-header">
              <h5 className="modal-title">{title || "Enter Biz Number"}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  onCancel();
                  setError("");
                }}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>{message || "Please enter a 7-digit business number."}</p>
              <input
                type="text"
                className={`form-control ${error ? "is-invalid" : ""}`}
                value={bizNumber}
                onChange={(e) => setBizNumber(e.target.value)}
              />
              {error && <div className="invalid-feedback">{error}</div>}
            </div>
            <div className="modal-footer mt-auto">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  onCancel();
                  setError("");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BizNumberInputModal;
