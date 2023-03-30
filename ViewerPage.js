import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import "./style.css";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./store/slices/AuthSlice";
import { useNavigate } from "react-router-dom";

const ViewerPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isLoggedIn);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [visiblePosts, setVisiblePosts] = useState("");
  const [clickedId, setClickedId] = useState(null);
  const logOut = () => {
    localStorage.clear();
    dispatch(logout());
  };
  function openModal(blogId) {
    setIsOpen(true);
    setClickedId(blogId);
  }
  function closeModal(e) {
    e.preventDefault();
    setIsOpen(false);
    setClickedId(null);
  }

  async function fetchData() {
    console.log("Fetching data...");
    const response = await axios.get(
      `https://gorest.co.in/public/v2/posts`,

      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    console.log("response", response.data);
    setVisiblePosts(response.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchInput?.length > 0) {
      let postsCopy = [...visiblePosts];
      let searchedPosts = postsCopy?.filter((blog) =>
        blog.title.toLowerCase().includes(searchInput.toLowerCase())
      );
      setVisiblePosts([...searchedPosts]);
    } else {
      fetchData();
    }
  }, [searchInput]);

  const displayPosts = () => {
    if (visiblePosts.length > 0) {
      return visiblePosts.map((post) => {
        const { id, userId, title, body } = post;
        return (
          <div className="myModal" key={id}>
            <div className="modal">
              <h2>{title.toUpperCase()}</h2>
              <p>{body.slice(0, 199)}</p>
              <span
                onClick={() => {
                  openModal(id);
                }}
                className="ReadMore"
              >
                {body.length >= 200 && "ReadMore"}
              </span>
            </div>
            {clickedId === id && (
              <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                <div>
                  <h2>{title.toUpperCase()}</h2>
                  <p>{body}</p>
                  <Icon onClick={closeModal} icon="charm:circle-cross" />
                </div>
              </Modal>
            )}
          </div>
        );
      });
    }
  };

  if (!isAuthenticated) {
    return navigate("/login");
  }

  return (
    <div>
      <nav>
        <div className="hm-cntnr">
          <Icon
            className="btn-cntnr"
            icon="mdi-light:home"
            onClick={() => navigate("/blogs")}
          />
          <div className="btn-cntnr">
            <button title="logout button" onClick={logOut}>
              LogOut
            </button>
          </div>
        </div>
      </nav>
      <div className="welcome">
        <h2 className="welcomeText">
          WELCOME {localStorage.getItem("name")} !
        </h2>
        <form
          className="searchBar"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // changePosts();
          }}
        >
          <input
            class="nosubmit"
            type="search"
            placeholder="Search..."
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
          />
        </form>
      </div>
      <div className="post-cntnr">{displayPosts()}</div>
    </div>
  );
};

export default ViewerPage;
