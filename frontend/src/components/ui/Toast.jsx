import React from "react";

const Toast = ({ message, type }) => {
  const toastTypes = {
    info: "alert-info",
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
  };
  const toastClass = toastTypes[type] || "alert alert-info";

  return (
    <div className="toast toast-top toast-center">
      <div className={`alert ${toastClass}`}>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
