import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Main = () => {
  const navigate = useNavigate();
  const { username, password, name } = useSelector((state) => state.users);

  if (
    localStorage.getItem("user") === username &&
    localStorage.getItem("password") === password
  ) {
    navigate("/blogs");
  } else {
    navigate("/login");
  }
  return (
    <button
      title="Click on button for login page"
      onClick={() => {
        navigate("/login");
      }}
    >
      Click here
    </button>
  );
};

export default Main;
