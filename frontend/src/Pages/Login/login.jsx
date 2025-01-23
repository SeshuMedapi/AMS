import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {
  emailvalidator,
  passwordvalidator,
} from "../../Shared modules/Exception handling/regexValidation";
import "../../scss/_login.scss";
import AMSLogo from "../../assets/login/ams_logo.png";
import ResetMail from "./resetMail";
import AuthContext from "../../Shared modules/Context management/authContext";
import { toast, ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import Modal from "../../View Components/Session components/LoginModal";
import BlockModal from "../../View Components/Session components/BlockedUserModal";
import ReactDOM from "react-dom";

function LoginPage() {
  const [oldPasswordType, setOldPasswordType] = useState("password");
  const [input, setInput] = useState({ email: "", password: "" });
  const [errorMessages, setErrorMessages] = useState({
    email: "",
    password: "",
    server: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [resetRequested, setResetRequested] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [Message, setMessage] = useState("");
  const [AdditionalMessage1, setAdditionalMessage1] = useState("");
  const [AdditionalMessage2, setAdditionalMessage2] = useState("");
  const [previousCredentials, setPreviousCredentials] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    //const sessionExpired = queryParams.get("sessionExpired");
    const token = queryParams.get("Tok");

    if (token) {
      toast.error(
        "The Link has expired. Please generate a new link in forget password.",
        {
          position: "top-center",
          style: {
            width: "100%",
          },
        }
      );
    }
  }, [location]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const logout = localStorage.getItem("logout");
    if (token && !logout) {
      const storedPermissions = localStorage.getItem("permissions");
      if (storedPermissions) {
        const permission = JSON.parse(storedPermissions);
        navigate("/dashboard");   
      }
    } else {
      localStorage.clear();
      sessionStorage.clear();
    }
  }, []);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    setErrorMessages({ ...errorMessages, [e.target.name]: "", server: "" });
  };

  const handleSubmit = async (e) => {
    if (isLoading) return;
    e.preventDefault();
    if (isLogin) {
      const emailError = !emailvalidator(input.email);
      const passwordError = !passwordvalidator(input.password);

      setErrorMessages({
        email: emailError ? "Please enter a valid email address." : "",
        password: passwordError ? "Invalid Credentials" : "",
        server: "",
      });

      if (!emailError && !passwordError) {
        setIsLoading(true);
        try {
          const email = input.email.toLowerCase();
          const response = await axiosInstance.post("/login", {
            username: email,
            password: input.password,
          });
          const token = response.data.token;
          if (token){
            const permissionvalue = response.data.permissions;
            const userdetail = response.data.user;
            const userdetailid = response.data.user.id;
            const session_time = response.data.session_time;
            localStorage.setItem("userId", userdetailid);
            localStorage.setItem("userLoggedIn", "true");
            localStorage.setItem("role",response.data.user.group_name)
            localStorage.setItem("firstname",response.data.user.first_name)
            localStorage.setItem("lastname",response.data.user.last_name)
            console.log(permissionvalue);
            login(token, permissionvalue, session_time); // Use the login function from the context
            navigate("/dashboard");
          } 
          else {
            const blocked_message = response.data.blocked_message;
            const policy_message = response.data.policy_message;
            if (blocked_message) {
              setShowBlockModal(true);
              setMessage(blocked_message);
              setAdditionalMessage1("");
              setAdditionalMessage2("");
            } else if (policy_message) {
              const additional_message1 = response.data.additional_message1;
              const additional_message2 = response.data.additional_message2;
              setShowBlockModal(true);
              setMessage(policy_message);
              setAdditionalMessage1(additional_message1);
              setAdditionalMessage2(additional_message2);
            } else {
              setPreviousCredentials({
                username: email,
                password: input.password,
              });
              setShowModal(true);
            }
          }
        } catch (error) {
          setErrorMessages({
            email: "",
            password: "",
            server:
              error.response.data.status || "Login failed. Please try again.",
          });
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      // Handle password reset request
      const emailError = !emailvalidator(input.email);
      setErrorMessages({
        email: emailError ? "Please enter a valid email address." : "",
        server: "",
      });

      if (!emailError) {
        setIsLoading(true);
        try {
          const email = input.email.toLowerCase();
          await axiosInstance.post("/resetpassword/request", {
            email: email,
          });
          console.log("Password reset request for:", input.email);
          setResetRequested(true);
          localStorage.setItem("sessionLoggedOut", false);
          //navigate("/ResetPassword");
        } catch (error) {
          setErrorMessages({
            email: "",
            server:
              error.response.data.status ||
              "Password reset failed. Please try again.",
          });
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleContinue = async () => {
    try {
      const response = await axiosInstance.post("/login", {
        username: previousCredentials.username,
        password: previousCredentials.password,
        override_session: true,
      });

      const token = response.data.token;
      const permissionvalue = response.data.permissions;
      const userdetail = response.data.user;
      const userdetailid = response.data.user.id;
      const session_time = response.data.session_time;
      localStorage.setItem("userId", userdetailid);
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("sessionTime", session_time);
      console.log(permissionvalue);
      login(token, permissionvalue, session_time); // Use the login function from the context
      // navigate("/dashboard"); // Redirect to dashboard after successful login
      //localStorage.setItem("token", token);

      //navigate("/dashboard");
      if (permissionvalue.includes("view_summary")) {
        navigate("/dashboard");
      } else {
        navigate("/user-management");
      }
      setShowModal(false);
      // Handle successful login (e.g., redirect to another page)
    } catch (error) {
      setErrorMessages({
        email: "",
        password: "",
        server: error.response.data.status || "Login failed. Please try again.",
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseBlockModal = () => {
    setShowBlockModal(false);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setInput({ email: "", password: "" });
    setErrorMessages({ email: "", password: "", server: "" });
  };

  const handleToggleOldPassword = () => {
    setOldPasswordType(oldPasswordType === "password" ? "text" : "password");
  };

  const [isEdge, setIsEdge] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const edge = /Edg/.test(userAgent);
    setIsEdge(edge);
  }, []);
  

  return resetRequested ? (
    <ResetMail />
  ) : (
    <section className="vh-100 back-color">
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-12">
            <div className="card shadow bg-body rounded card-width">
              <div className="row">
                <div className="col-md-5 col-lg-6 d-none d-md-block ">
                  <div>
                    <img
                      src={AMSLogo}
                      alt="login form"
                      className="img-adg w-100 m-3"
                    />
                    
                  </div>
                </div>
                <div className="col-md-7 col-lg-6 d-flex justify-content-center align-items-center">
                  <div className="card-body text-black">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4 ms-5 mt-5">
                      <div className="mb-4 ms-5 mt-5">
                          <h1 className="title">AttenDo</h1>
                      </div>

                        <h1 className="h2 fw-bold">
                          {isLogin ? "Login" : "Forgot Password"}
                        </h1>
                        <h5 className="fw-normal letterSpacing">
                          {isLogin
                            ? "Please login with your credentials"
                            : "No worries, we'll send you reset instructions."}
                        </h5>
                      </div>
                      <div data-mdb-input-init className="form-outline mb-4">
                        <label
                          className="form-label ms-5 fw-bold"
                          htmlFor="form2Example17"
                        >
                          Email ID
                        </label>
                        <input
                          type="email"
                          id="form2Example17"
                          className="form-control form-control-lg ms-5 input-width"
                          name="email"
                          value={input.email}
                          onChange={handleChange}
                          placeholder="Enter Email Id"
                        />
                        {errorMessages.email && (
                          <div className="text-danger ms-5">
                            {errorMessages.email}
                          </div>
                        )}
                      </div>
                      {isLogin && (
                        <div data-mdb-input-init className="form-outline mb-4">
                          <label
                            className="form-label ms-5 fw-bold"
                            htmlFor="form2Example27"
                          >
                            Password
                          </label>
                          <div className="position-relative ms-5 input-width">
                            <input
                              type={oldPasswordType}
                              id="form2Example27"
                              className="form-control form-control-lg inputField"
                              name="password"
                              value={input.password}
                              onChange={handleChange}
                              placeholder="Enter Password"
                            />
                            <FontAwesomeIcon
                              icon={
                                oldPasswordType === "password"
                                  ? faEyeSlash
                                  : faEye
                              }
                              id="edge-hidden-icon" 
                              style={{ display: isEdge ? 'none' : 'block' }}
                              className="position-absolute top-50 end-0 translate-middle-y me-3"
                              onClick={handleToggleOldPassword}
                            />
                          </div>
                          {errorMessages.password && (
                            <div className="text-danger ms-5">
                              {errorMessages.password}
                            </div>
                          )}
                        </div>
                      )}
                      {errorMessages.server && (
                        <div className="text-danger text-center mb-4">
                          {errorMessages.server}
                        </div>
                      )}
                      {isLogin && (
                        <div className="fw-bold mb-3 ms-5">
                          <a
                            className="forget-pass ms-2"
                            href="#!"
                            onClick={toggleForm}
                          >
                            Forgot Password?
                          </a>
                        </div>
                      )}
                      <div className="d-flex justify-content-center mb-4 me-3">
                        <button
                          className="btn btn-dark btn-lg login-btn"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLogin ? "Login" : "Reset Password"}
                        </button>
                      </div>
                      {!isLogin && (
                        <div className="text-center mb-2 ">
                          <a
                            className="forget-pass"
                            href="#!"
                            onClick={toggleForm}
                          >
                            Back to Login
                          </a>
                        </div>
                      )}
                      <div className="text-center mb-2 mt-5 ">
                        <p className="mb-1">
                          For login or technical issues, contact&nbsp;
                          <a
                            className="contct-link fw-bold"
                            href="mailto:admin@jivass.com"
                          >
                            contact@jivass.com
                          </a>
                        </p>
                      </div>
                      <ToastContainer
                        position="top-center"
                        style={{
                          position: "fixed",
                          top: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "60%",
                          padding: "0 20px" /* Optional padding */,
                        }}
                      />
                      {/* {showModal &&
                        ReactDOM.createPortal(
                          <Modal
                            message={Message}
                            onClose={handleCloseModal}
                            onLogin={handleContinue} // Pass the login handler
                          />,
                          document.body
                        )} */}
                    </form>
                    {showBlockModal &&
                      ReactDOM.createPortal(
                        <BlockModal
                          onClose={handleCloseBlockModal}
                          onLogin={handleCloseBlockModal}
                          message={Message}
                          additional_message1={AdditionalMessage1}
                          additional_message2={AdditionalMessage2} // Pass the login handler
                        />,
                        document.body
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;