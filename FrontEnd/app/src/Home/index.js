import Cookies from "js-cookie";
import { Redirect, Link } from "react-router-dom";

import Header from "../Header";

import "./index.css";

const Home = () => {
  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken === undefined) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-heading">Organic Coffee</h1>
          <h2 className="home-heading-h">Exclusive Product New Arrival</h2>
          <h3 className="home-heading-h">SPECIAL BLEND</h3>
          <img
            src="https://th.bing.com/th/id/OIP.zNAeaa82gWniHE6LUjhkIAHaHa?pid=ImgDet&rs=1"
            alt="clothes that get you noticed"
            className="home-mobile-img"
          />
          <p className="home-description">
            BREAKFAST PRODUCTS ON SALE UPTO 50%
          </p>
          <Link to="/shop">
            <button type="button" className="shop-now-button">
              Shop Now
            </button>
          </Link>
        </div>
        <img
          src="https://th.bing.com/th/id/OIP.zNAeaa82gWniHE6LUjhkIAHaHa?pid=ImgDet&rs=1"
          alt="clothes that get you noticed"
          className="home-desktop-img"
        />
      </div>
    </>
  );
};

export default Home;
