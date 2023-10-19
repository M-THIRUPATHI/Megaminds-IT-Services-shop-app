import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Loader from "react-loader-spinner";
import Header from "../Header";
import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const Account = () => {
  const [profile, setProfile] = useState({});
  const jwtToken = Cookies.get("jwt_token");
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  useEffect(() => {
    setApiStatus(apiStatusConstants.inProgress);
    const getProfile = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };
        const response = await axios.get("http://localhost:4000/account", {
          headers,
        });
        setProfile(response.data);
        setApiStatus(apiStatusConstants.success);
      } catch (error) {
        console.log(`Error : ${error.message}`);
        setApiStatus(apiStatusConstants.failure);
      }
    };
    getProfile();
  }, [jwtToken]);

  const renderProgressView = () => {
    return (
      <>
        <Header />
        <div className="products-loader-container">
          <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
        </div>
      </>
    );
  };

  const renderSuccessView = () => {
    return (
      <>
        <Header />
        <div className="account-container">
          <div className="account-content">
            <h1 className="account-heading">My Account</h1>
            <p className="account-description account-description-name">
              Name:
            </p>
            <p className="account-description">{profile.username}</p>
            <p className="account-description account-description-email">
              Email:
            </p>
            <p className="account-description">{profile.email}</p>
          </div>
        </div>
      </>
    );
  };

  const renderFailureView = () => {
    return (
      <>
        <Header />
        <div className="products-error-view-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
            alt="all-products-error"
            className="products-failure-img"
          />
          <h1 className="product-failure-heading-text">
            Oops! Something Went Wrong
          </h1>
          <p className="products-failure-description">
            We are having some trouble processing your request. Please try
            again.
          </p>
        </div>
      </>
    );
  };

  switch (apiStatus) {
    case apiStatusConstants.inProgress:
      return renderProgressView();
    case apiStatusConstants.success:
      return renderSuccessView();
    case apiStatusConstants.failure:
      return renderFailureView();
    default:
      return null;
  }
};

export default Account;
