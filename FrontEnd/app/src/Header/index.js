import { Link, withRouter } from "react-router-dom";

import Cookies from "js-cookie";

//import CartContext from "../../context/CartContext";

import "./index.css";

const Header = (props) => {
  const onClickLogout = () => {
    const { history } = props;
    Cookies.remove("jwt_token");
    history.replace("/login");
  };

  const renderCartItemsCount = () => {
    return <span className="cart-count-badge">0</span>;
    /*<CartContext.Consumer>
      {(value) => {
        const { cartList } = value;
        const cartItemsCount = cartList.length;
        return (
          <>
            {cartItemsCount > 0 ? (
              <span className="cart-count-badge">{cartList.length}</span>
            ) : null}
          </>
        );
      }}
    </CartContext.Consumer> */
  };

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <div className="nav-bar-mobile-logo-container">
          <Link to="/">
            <img
              className="website-logo"
              src="https://nuturemite.info/wp-content/uploads/2022/10/nuturmite_logo_tranparent.png"
              alt="website logo"
            />
          </Link>

          <button type="button" className="nav-mobile-btn">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-log-out-img.png"
              alt="nav logout"
              className="nav-bar-image"
              onClick={onClickLogout}
            />
          </button>
        </div>

        <div className="nav-bar-large-container">
          <Link to="/">
            <img
              className="website-logo"
              src="https://nuturemite.info/wp-content/uploads/2022/10/nuturmite_logo_tranparent.png"
              alt="website logo"
            />
          </Link>
          <ul className="nav-menu">
            <li className="nav-menu-item">
              <Link to="/" className="nav-link">
                HOME
              </Link>
            </li>

            <li className="nav-menu-item nav-menu-item-hover nav-menu-item-active">
              <Link to="/shop" className="nav-link">
                SHOP
              </Link>
            </li>

            <li className="nav-menu-item nav-menu-item-hover nav-menu-item-active">
              <Link to="/account" className="nav-link">
                MY ACCOUNT
              </Link>
            </li>

            <li className="nav-menu-item nav-menu-item-hover nav-menu-item-active">
              <Link to="/about" className="nav-link">
                ABOUT US
              </Link>
            </li>

            <li className="nav-menu-item nav-menu-item-hover nav-menu-item-active">
              <Link to="/cart" className="nav-link">
                CART
                {renderCartItemsCount()}
              </Link>
            </li>
          </ul>
          <button
            type="button"
            className="logout-desktop-btn"
            onClick={onClickLogout}
          >
            LOGOUT
          </button>
        </div>
      </div>
      <div className="nav-menu-mobile">
        <ul className="nav-menu-list-mobile">
          <li className="nav-menu-item-mobile">
            <Link to="/" className="nav-link">
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-home-icon.png"
                alt="nav home"
                className="nav-bar-image"
              />
            </Link>
          </li>

          <li className="nav-menu-item-mobile">
            <Link to="/shop" className="nav-link">
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-products-icon.png"
                alt="nav products"
                className="nav-bar-image"
              />
            </Link>
          </li>

          <li className="nav-menu-item-mobile">
            <Link to="/account" className="nav-link">
              <img
                src="https://th.bing.com/th/id/OIP.KaHMohIzRPqlM5XW-RMlnQHaHa?pid=ImgDet&w=600&h=600&rs=1"
                alt="nav home"
                className="nav-bar-image"
              />
            </Link>
          </li>

          <li className="nav-menu-item-mobile">
            <Link to="/about" className="nav-link">
              <img
                src="https://www.freeiconspng.com/thumbs/about-us-icon/information-about-us-icon-16.png"
                alt="nav home"
                className="nav-bar-image"
              />
            </Link>
          </li>

          <li className="nav-menu-item-mobile">
            <Link to="/cart" className="nav-link">
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-cart-icon.png"
                alt="nav cart"
                className="nav-bar-image"
              />
              {renderCartItemsCount()}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default withRouter(Header);
