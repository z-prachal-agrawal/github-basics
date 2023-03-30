import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import "./style.css";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./store/slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { getAllPosts } from "./PostApi";
import {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  appendPost,
} from "./store/slices/PostSlice";

const EditorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { username, password } = useSelector((state) => state.users);
  const isAuthenticated = useSelector((state) => state.auth.isLoggedIn);
  const posts = useSelector((state) => state.post.data);

  const [modalIsOpen, setIsOpen] = useState(false);
  const [editModalIsOpen, setIsEditOpen] = useState(false);
  const [newModalIsOpen, setNewModalIsOpen] = useState(false);
  const [tab, setTab] = useState("myBlogs");
  const [searchInput, setSearchInput] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedBody, setUpdatedBody] = useState("");
  const [updatePostObj, setUpdatePostObj] = useState("");
  const [visiblePosts, setvisiblePosts] = useState("");
  const [clickedId, setClickedId] = useState(null);

  function handleTitleChange(event) {
    setTitle(event.target.value);
  }

  function handleBodyChange(event) {
    setBody(event.target.value);
  }

  useEffect(() => {
    dispatch(fetchPostsStart());
    getAllPosts()
      .then((posts) => {
        dispatch(fetchPostsSuccess(posts));
      })
      .catch((error) => {
        dispatch(fetchPostsFailure(error.message));
      });
  }, [dispatch]);
  useEffect(() => {
    if (tab === "allBlogs") setvisiblePosts(posts);
  }, [tab]);
  useEffect(() => {
    let postsCopy = [...posts];
    let searchedPosts = postsCopy?.filter((blog) =>
      blog.title.toLowerCase().includes(searchInput.toLowerCase())
    );
    setvisiblePosts([...searchedPosts]);
  }, [searchInput]);

  async function fetchData() {
    const response = await axios.get(
      `https://gorest.co.in/public/v2/users/${localStorage.getItem(
        "password"
      )}/posts`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );

    setvisiblePosts(response.data);
  }
  useEffect(() => {
    if (tab === "myBlogs") fetchData();
  }, [tab]);

  useEffect(() => {
    if (updatePostObj && Object.keys(updatePostObj)?.length > 0) {
      updatePostObj?.title && setUpdatedTitle(updatePostObj.title);
      updatePostObj?.body && setUpdatedBody(updatePostObj.body);
    }
  }, [updatePostObj]);

  async function handleDeleteClick(event, postId) {
    event.preventDefault();
    if (window.confirm("Are you sure you want to delete this blog?")) {
      const response = await axios.delete(
        `https://gorest.co.in/public/v2/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      fetchData();
    }
  }
  async function handleUpdate(event, postId) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", updatedTitle);
    formData.append("body", updatedBody);
    const response = await axios.patch(
      `https://gorest.co.in/public/v2/posts/${postId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    console.log(response.data);
    setIsEditOpen(false);
    fetchData();
  }

  async function handlePublish(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    const response = await axios.post(
      `https://gorest.co.in/public/v2/users/${password}/posts`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    console.log(response.data);
    dispatch(appendPost(response.data));
    setNewModalIsOpen(false);
    visiblePosts.push(response.data);
  }

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };
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
  function openEditModal(event, postObj) {
    event.preventDefault();
    setIsEditOpen(true);
    setUpdatePostObj(postObj);
  }
  function closeEditModal(e) {
    e.preventDefault();
    setIsEditOpen(false);
  }
  function openNewModal() {
    setNewModalIsOpen(true);
  }
  function closeNewModal(e) {
    e.preventDefault();
    setNewModalIsOpen(false);
  }

  const displayPosts = () => {
    console.log("???", visiblePosts);
    if (visiblePosts.length > 0) {
      return visiblePosts.map((post) => {
        const { id, userId, title, body } = post;
        return (
          <div className="myModal" key={id}>
            <div className="modal">
              <h2 className="body">{title.toUpperCase()}</h2>
              <p className="body">{body.slice(0, 199)}</p>
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

                  <Icon
                    //className="crcl-crss"
                    onClick={closeModal}
                    icon="charm:circle-cross"
                  />
                </div>
              </Modal>
            )}
          </div>
        );
      });
    }
  };
  const myBlogs = () => {
    console.log("myposts", visiblePosts);
    if (visiblePosts.length === 0) {
      return (
        <div className="myModal">
          <h3>No Blogs</h3>
        </div>
      );
    }

    if (visiblePosts.length > 0) {
      return visiblePosts.map((post) => {
        const { id, userId, title, body } = post;
        return (
          <div key={id}>
            <div className="myModal">
              <div className="modal">
                <h2>{title.toUpperCase()}</h2>
                <p>{body.slice(0, 199)}</p>
                <p
                  onClick={() => {
                    openModal(id);
                  }}
                  className="ReadMore"
                >
                  {body.length >= 200 && "ReadMore"}
                </p>
                <div className="icn-design">
                  <Icon
                    onClick={(e) => openEditModal(e, post)}
                    icon="material-symbols:edit-note"
                    height="40"
                  />
                  <Icon
                    icon="ic:baseline-delete"
                    height="40"
                    onClick={(event) => {
                      handleDeleteClick(event, id);
                    }}
                  />
                </div>
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
          </div>
        );
      });
    }
  };
  if (!isAuthenticated) {
    return navigate("/login");
  }

  return (
    <div className="whole-cntnr">
      <div className="hm-cntnr">
        <Icon className="btn-cntnr" icon="mdi-light:home" />
        <div className="btn-cntnr">
          <button title="Logout from here" onClick={logOut}>
            LogOut
          </button>
        </div>
      </div>

      <div className="welcome">
        <h2 className="welcomeText">WELCOME {localStorage.getItem("name")}!</h2>
        <div className="formWrapper">
          <form className="searchBar">
            <input
              class="nosubmit"
              onSubmit={(e) => {
                e.preventDefault();
              }}
              type="search"
              placeholder="Search..."
              onChange={handleChange}
              value={searchInput}
            />
          </form>
          <button
            title="click to write new blog"
            id="newblog"
            onClick={openNewModal}
          >
            New Blog
          </button>
        </div>
      </div>
      <div className="sb-nv-cntnr">
        <button
          title="click to read all blogs"
          className="blogs"
          onClick={() => setTab("allBlogs")}
        >
          All Blogs
        </button>
        <button
          title="click to read your own blogs"
          className="blogs"
          onClick={() => setTab("myBlogs")}
        >
          My Blogs
        </button>
      </div>

      {tab === "allBlogs" && <div className="post-cntnr">{displayPosts()}</div>}
      {tab === "myBlogs" && <div className="post-cntnr">{myBlogs()}</div>}

      <Modal
        className="modalContainer"
        isOpen={newModalIsOpen}
        onRequestClose={closeNewModal}
      >
        <div className="container">
          <div className="cross-container">
            <Icon
              onClick={closeNewModal}
              className="icon"
              icon="charm:circle-cross"
            />
          </div>
          <div className="header">
            <h1>New Blog</h1>
          </div>
          <div className="formdata">
            <form>
              <div>
                <label>Title</label>
                <input type="text" onChange={handleTitleChange} />
              </div>
              <div>
                <label>Body</label>
                <textarea onChange={handleBodyChange} />
              </div>
            </form>
          </div>
          <div className="btns">
            <button title="Cancel changes" onClick={closeNewModal}>
              Cancel
            </button>
            <button
              title="Publish your blog"
              onClick={handlePublish}
              style={{ backgroundColor: "lightgreen" }}
            >
              Publish
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        className="modalContainer"
        isOpen={editModalIsOpen}
        onRequestClose={closeEditModal}
      >
        <div className="container">
          <div className="cross-container">
            <Icon
              className="icon"
              onClick={closeEditModal}
              icon="charm:circle-cross"
            />
          </div>
          <div className="header">
            <h1>Edit your Blog</h1>
          </div>
          <div className="formdata">
            <form>
              <div>
                <label>Title</label>

                <input
                  type="text"
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                />
              </div>

              <div>
                <label>Body</label>

                <textarea
                  value={updatedBody}
                  onChange={(e) => setUpdatedBody(e.target.value)}
                />
              </div>
            </form>
          </div>
          <div className="btns">
            <button title="close modal" onClick={closeEditModal}>
              Cancel
            </button>
            <button
              title="save changes"
              style={{ backgroundColor: "lightgreen" }}
              onClick={(event) => {
                console.log(updatePostObj.id);
                handleUpdate(event, updatePostObj.id);
              }}
            >
              Update
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditorPage;
