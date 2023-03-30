import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "./store/slices/LoggedUserSlice";
import { loggedin } from "./store/slices/AuthSlice";
import "./LoginPage.css";
const LoginPage = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();

    let data = null;
    (async () => {
      try {
        const response = await axios.get(
          `https://gorest.co.in/public/v2/users/${password}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        data = response.data ? response.data : response;
        console.log(data);
      } catch (error) {
        console.log(error);
      }
      if (data.message) {
        alert("Please enter valid credentials");
      }
      if (data.email && data.email === username) {
        localStorage.setItem("user", username);
        localStorage.setItem("password", password);
        localStorage.setItem("name", data.name);
        localStorage.setItem("isAuthenticated", true);
        alert("User is logged in");
        dispatch(login({ username, password }));
        dispatch(loggedin());
        if (
          localStorage.getItem("user") === username &&
          localStorage.getItem("password") === password
        ) {
          navigate("/blogs");
        }
      } else {
        alert("Please enter valid username");
      }
    })();
  };

  return (
    <div>
      <div className="form-cntnr">
        <form onSubmit={handleSubmit}>
          <div className="head">
            <h1>Welcome to BlogJot</h1>
          </div>
          <div className="cntnr">
            <div className="cntnr-mid">
              <div>
                <label className="form-fields">UserName</label>
                <div className="set">
                  <input
                    className="inputdata"
                    type="text"
                    placeholder="username"
                    required
                    value={username}
                    autoComplete="off"
                    onChange={(e) => setusername(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="form-fields">Password</label>
                <div className="set">
                  <input
                    className="inputdata"
                    type="password"
                    placeholder="password"
                    required
                    value={password}
                    autoComplete="off"
                    onChange={(e) => setpassword(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="lgn-btn"
                type="submit"
                title="Please click to read blogs"
              >
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
