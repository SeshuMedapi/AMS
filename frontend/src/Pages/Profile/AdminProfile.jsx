import React, { useState, useEffect } from "react";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import ProfileImage from "../../assets/Profile/contactProfile.png";
import LockIcon from "../../assets/Profile/Password.svg";
import SlideIcon from "../../assets/Profile/CaretRight.svg";
import LogoutIcon from "../../assets/Profile/Logout.svg";
import ProfileEditor from "./ProfileEdit";
import ChangePassword from "./ChangePswd";
import LogoutProfile from "./logout";
import CameraImg from "../../assets/camera.png";
import Alert from "react-bootstrap/Alert";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminProfile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showChangePswd, setShowChangePswd] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [profileImage, setProfileImage] = useState(ProfileImage);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    document.title = "AMS";
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.get("/myinfo");
        setUser(response.data);
      } catch (error) {
        setApiError(error.message);
      }
    };

    fetchProfileData();
    fetchProfileImage();
  }, []);

  const fetchProfileImage = async () => {
    try {
      const response = await axiosInstance.get("/profile_picture");
      console.log(response)
      if (response.status == 200) {
        console.log('backend'+response.data.url)
        setProfileImage(response.data.url);
        console.log(response.data);
      } else {
        setProfileImage(ProfileImage);
      }
    } catch (error) {
      setApiError("Failed to fetch profile image: " + error.message);
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("profile_picture", file);
    console.log(formData);
    try {
      console.log("Uploading to /api/profile_picture");

      const response = await axiosInstance.post("/profile_picture", formData);

      if (response.data.profile_picture) {
        setUser((prevUser) => ({
          ...prevUser,
          profileImageUrl: response.data.profile_picture,
        }));
      }
      fetchProfileImage();
    } catch (error) {
      setApiError("Failed to upload image: " + error.message);
    }
  };
  const handleEditProfile = () => {
    setEditMode(true);
  };
  const handlesaved = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const handleCancel = () => {
    setEditMode(false);
    setShowChangePswd(false);
    setShowLogout(false);
  };

  const handleShowChangePswd = () => {
    setShowChangePswd(!showChangePswd);
  };

  const handleLogout = () => {
    setShowLogout(true);
  };

  const handSave = (updatedUser) => {
    setUser(updatedUser);
    setEditMode(false);
  };

  return (
    <div className="outer-container d-flex">
      <div className="container">
        <div className="row">
          <div className="col-8">
            <div className="inner-container">
              <div className="inner-container2 d-flex">
                <div className="inner-container3">
                  <div className="usercircle">
                    <img
                      className="usercircleimgupload"
                      src={profileImage}
                      // alt="user Icon"
                    />

                    <label htmlFor="upload-image" className="imagecam">
                      <img
                        className="overlay-image"
                        src={CameraImg}
                        alt="cameraicon"
                      />
                    </label>
                    <input
                      type="file"
                      id="upload-image"
                      className="Admin-profile-input"
                      onChange={handleImageChange}
                    />
                  </div>

                  <div className="container-lbls d-flex mb-9">
                    <div className="d-flex">
                      <div className="mailicon"> </div>

                      <div className="input-container-mail ms-2 mt-3">
                        <label className="lblmailphone">Email</label>
                        <div>
                          <label className="nameeinput">
                            {user && user.email}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex ms-5">
                      <div className="phoneicon"> </div>

                      <div className="input-container-mail ms-2 mt-3">
                        <label className="lblmailphone">Phone Number</label>
                        <div>
                          <label className="nameeinput">
                            {user && user.phone_number}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="inner-container4">
                  <label className="lblname mt-5 ms-3 lblmailphone">Name</label>
                  <div>
                    <label className="lblInputName ms-3">
                      {user && user.first_name} &nbsp;
                      {user && user.last_name}
                    </label>
                  </div>
                </div>
              </div>

              <div
                className="second-sub-container mt-5"
                onClick={handleShowChangePswd}
              >
                <div className="lock-icon">
                  <img src={LockIcon} alt="lock icon" />
                </div>
                <div
                  className="changepwsd fw-bold"
                  onClick={handleShowChangePswd}
                >
                  Change Password
                </div>
                <div className="another-icon">
                  <img src={SlideIcon} alt="slide icon" />
                </div>
              </div>
              <div className="third-sub-container" onClick={handleLogout}>
                <div className="lock-icon">
                  <img src={LogoutIcon} alt="logout icon" />
                </div>
                <div className="changepwsd fw-bold">Logout</div>
                <div className="slide-icon">
                  <img src={SlideIcon} alt="slide icon" />
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="outer-container2">
              {/* {apiError && (
                <div className="alert alert-danger mt-3">{apiError}</div>
              )} */}
              {showChangePswd && <div className="overlay"></div>}
              {showLogout && <div className="overlay"></div>}

              {editMode && (
                <div className="overlay" onClick={handleCancel}></div>
              )}
              {!editMode && (
                <button
                  type="button"
                  className="edit_profile_btn"
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </button>
              )}
              <Alert
                className="mt-3"
                show={showSuccess}
                variant="success"
                onClose={() => setShowSuccess(false)}
                dismissible
              >
                Password Changed successfully!
              </Alert>
              {editMode && (
                <ProfileEditor
                  user={user}
                  handleCancel={handleCancel}
                  handSave={handSave}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {showChangePswd && (
        <ChangePassword handleCancel={handleCancel} handlesaved={handlesaved} />
      )}
      {showLogout && <LogoutProfile handleCancel={handleCancel} />}
    </div>
  );
}

export default AdminProfile;
