import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {
  Confirm_passwordvalidator,
  passwordvalidator,
} from "../../Shared modules/Exception handling/regexValidation";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import "../../scss/_login.scss";
import tooltip from "../../../src/assets/tooltip/tool2.png";
import AMSLogo from "../../assets/login/ams_logo.png";
import Successlogo from "../../assets/login/Success.svg";

function ResetPassword() {
  const [input, setInput] = useState({ password: "", confirm_password: "" });
  const [oldPasswordType, setOldPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [showTooltip, setShowTooltip] = useState(false);

  const [errorMessages, setErrorMessages] = useState({
    password: "",
    confirm_password: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const validateToken = async (token) => {
      try {
        const response = await axiosInstance.post(
          "/resetpassword/istokenvalid",
          {
            token,
          }
        );
        console.log(response.data);
        if (response.data.status == "success") {
        } else {
          navigate(`/?Tok=false`);
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        navigate(`/?Tok=false`);
      }
    };

    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");
    console.log(token);
    if (token) {
      validateToken(token);
    } else {
      navigate(`/?Tok=false`);
    }
  }, [navigate, location]);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    setErrorMessages({ ...errorMessages, [e.target.name]: "" });
  };

  const handleSubmit = async () => {
    let passwordError = "";
    let confirm_passwordError = "";

    if (!input.password) {
      passwordError = "Password is required.";
    } else if (!passwordvalidator(input.password)) {
      passwordError =
        "Please enter a valid password (At least 8 characters, one uppercase, and one symbol)";
    }

    if (!input.confirm_password) {
      confirm_passwordError = "Confirm Password is required.";
    } else if (
      input.password !== input.confirm_password ||
      !Confirm_passwordvalidator(input.confirm_password)
    ) {
      confirm_passwordError = "Passwords do not match.";
    }

    setErrorMessages({
      password: passwordError,
      confirm_password: confirm_passwordError,
    });

    //   if (!passwordError && !confirm_passwordError) {
    //     const searchParams = new URLSearchParams(location.search);
    //     const token = searchParams.get("token");
    //     console.log(token);
    //     try {
    //       const response = await axiosInstance.post("/resetpassword", {
    //         token,
    //         password: input.password,
    //       });
    //       console.log("Response data:", response.data);

    //       if (response.data.success) {
    //         setShowSuccess(true);
    //         setInput({ password: "", confirm_password: "" });
    //       } else {
    //         setErrorMessages({
    //           ...errorMessages,
    //           password: "Password reset failed. Please try again.",
    //         });
    //       }
    //     } catch (error) {
    //       console.error("Password reset failed:", error);
    //       setErrorMessages({
    //         ...errorMessages,
    //         password: "Password reset failed. Please try again.",
    //       });
    //     }
    //   }
    // };
    if (!passwordError && !confirm_passwordError) {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get("token");
      try {
        const response = await axiosInstance.post("/resetpassword", {
          token,
          password: input.password,
        });
        console.log("Response data:", response.data);

        if (response.data.status === "success") {
          setShowSuccess(true);
          setInput({ password: "", confirm_password: "" });
          setErrorMessages({ password: "", confirm_password: "" });
        } else {
          setErrorMessages({
            ...errorMessages,
            password: "Password reset failed. Please try again.",
          });
        }
      } catch (error) {
        console.error("Password reset failed:", error);
        setErrorMessages({
          ...errorMessages,
          password: "Password reset failed. Please try again.",
        });
      }
    }
  };

  const handleTooltipMouseOver = () => {
    setShowTooltip(true);
  };
  const handleTooltipMouseOut = () => {
    setShowTooltip(false);
  };
  const handleLogin = () => {
    navigate("/");
  };

  const handleToggleOldPassword = () => {
    setOldPasswordType(oldPasswordType === "password" ? "text" : "password");
  };

  const handleToggleConfirmPassword = () => {
    setConfirmPasswordType(
      confirmPasswordType === "password" ? "text" : "password"
    );
  };

  return (
    <section className="vh-100 back-color">
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card shadow bg-body rounded card-width">
              <div className="row">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  {/* <img
                    src="src/assets/login/Illustration.svg"
                    alt="login form"
                    className="img-adg"
                  /> */}
                  <img
                    src={AMSLogo}
                    alt="login form"
                    className="img-adg w-100 m-0"
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex justify-content-center align-items-center">
                  <div className="card-body text-black">
                    <form>
                      {!showSuccess ? (
                        <div className="mb-2 ">
                          <h1 className="h1 fw-bold text-center">
                            Reset Password{" "}
                          </h1>
                        </div>
                      ) : (
                        <div className="text-center mb-4">
                          <img src={Successlogo} alt="Green tick" />
                        </div>
                      )}
                      {!showSuccess ? (
                        <>
                          <div
                            data-mdb-input-init
                            className="form-outline mb-4"
                          >
                            <label
                              className="form-label ms-5 fw-bold"
                              htmlFor="password"
                            >
                              Password{" "}
                              <div className="tooltip-container">
                                <img
                                  src={tooltip}
                                  alt="Tooltip"
                                  className="tooltipimage ms-2 mb-2"
                                  onMouseOver={handleTooltipMouseOver}
                                  onMouseOut={handleTooltipMouseOut}
                                />
                                <div
                                  className={`tooltip-message ${
                                    showTooltip ? "visible" : ""
                                  }`}
                                  id="tooltipMessage"
                                >
                                  Be at least 8 characters long, Include at
                                  least one uppercase letter, Contain at least
                                  one symbol (#, @, $)."
                                </div>
                              </div>
                            </label>
                            <div className="position-relative ms-5 input-width">
                              <input
                                type={oldPasswordType}
                                id="password"
                                placeholder="Enter Password"
                                className="form-control form-control-lg inputField"
                                name="password"
                                value={input.password}
                                onChange={handleChange}
                              />
                              <FontAwesomeIcon
                                icon={
                                  oldPasswordType === "password"
                                    ? faEyeSlash
                                    : faEye
                                }
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
                          <div
                            data-mdb-input-init
                            className="form-outline mb-4"
                          >
                            <label
                              className="form-label ms-5 fw-bold"
                              htmlFor="confirm_password"
                            >
                              Confirm Password
                            </label>
                            <div className="position-relative ms-5 input-width ">
                              <input
                                type={confirmPasswordType}
                                id="confirm_password"
                                placeholder="Enter Confirm Password"
                                className="form-control form-control-lg inputField"
                                name="confirm_password"
                                value={input.confirm_password}
                                onChange={handleChange}
                              />
                              <FontAwesomeIcon
                                icon={
                                  confirmPasswordType === "password"
                                    ? faEyeSlash
                                    : faEye
                                }
                                className="position-absolute top-50 end-0 translate-middle-y me-3"
                                onClick={handleToggleConfirmPassword}
                              />
                            </div>
                            {errorMessages.confirm_password && (
                              <div className="text-danger ms-5">
                                {errorMessages.confirm_password}
                              </div>
                            )}
                          </div>

                          <div className="d-flex justify-content-center mb-4 me-3">
                            <button
                              className="btn btn-dark btn-lg login-btn"
                              type="button"
                              onClick={handleSubmit}
                            >
                              Set Password
                            </button>
                          </div>
                        </>
                      ) : (
                        <div>
                          <div className="text-center mb-4">
                            <h3 className="mb-4 d-inline">
                              Password Reset Successfully
                            </h3>
                          </div>
                          <div className="d-flex justify-content-center mb-4 me-3">
                            <button
                              className="btn btn-dark btn-lg login-btn"
                              type="button"
                              onClick={handleLogin}
                            >
                              Login
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="text-center mb-2 ">
                        {!showSuccess && (
                          <a
                            className="forget-pass"
                            href="#"
                            onClick={handleLogin}
                          >
                            Back to Login
                          </a>
                        )}
                      </div>
                      <div className="text-center mb-2 mt-5 ">
                        <p className="mb-1">
                          For login or technical issues, contact
                        </p>
                        <a
                          href="mailto:contact@jivass.com"
                          className="contct-link"
                        >
                          contact@jivass.com
                        </a>
                      </div>
                    </form>
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

export default ResetPassword;
