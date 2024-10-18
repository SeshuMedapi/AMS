import React from "react";
import { useNavigate } from "react-router-dom";
import "../../scss/_login.scss";
import AMSLogo from "../../assets/login/ams_logo.png";
import Successlogo from "../../assets/login/Success.svg";

function ResetMail() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <section className="vh-100 back-color">
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card shadow bg-body rounded card-width">
              <div className="row">
                <div className="col-md-6 col-lg-5 d-none d-md-block img-back-col">
                  {/* <img
                    src="/src/assets/login/Illustration.svg"
                    alt="Illustration"
                    className="img-adg"
                  /> */}
                  <img src={DisLogo} alt="login form" className="img-adg" />
                </div>
                <div className="col-md-6 col-lg-7 d-flex justify-content-center align-items-center">
                  <div className="card-body text-black">
                    <form>
                      <div className="text-center mb-4">
                        <img src={Successlogo} alt="Success" />
                      </div>
                      <div className="text-center mb-4">
                        <h3 className="mb-4 d-inline">
                          Password reset link sent{" "}
                        </h3>
                        <h3 className="text-success d-inline">
                          to your email{" "}
                        </h3>
                      </div>
                      <div className="d-flex justify-content-center mb-4 me-3">
                        <button
                          className="btn btn-dark btn-lg login-btn"
                          type="submit"
                          onClick={handleLogin}
                        >
                          Login
                        </button>
                      </div>
                      <div className="text-center mb-2 mt-5">
                        <p className="mb-1">
                          For login or technical issues, contact
                        </p>
                        <a
                          href="mailto:support.subrogation@dminc.com"
                          className="contct-link"
                        >
                          support.subrogation@dminc.com
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

export default ResetMail;
