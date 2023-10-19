import { Component } from "react";
import Loader from "react-loader-spinner";
import { BsSearch, BsFilterRight } from "react-icons/bs";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import Header from "../Header";

import "./index.css";

const Shop = () => (
  <>
    <Header />
    <div className="product-sections">
      <AllProductsSection />
    </div>
  </>
);

export default Shop;

const categoryOptions = [
  {
    name: "Organic",
    categoryId: "ORGANIC",
  },
  {
    name: "Ayurvedic",
    categoryId: "AYURVEDIC",
  },
  {
    name: "Antioxidants",
    categoryId: "ANTIOXIDANTS",
  },
];

const sortbyOptions = [
  {
    optionId: "PRICE_HIGH",
    displayText: "Price (High-Low)",
  },
  {
    optionId: "PRICE_LOW",
    displayText: "Price (Low-High)",
  },
];

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

export class AllProductsSection extends Component {
  state = {
    productsList: [],
    apiStatus: apiStatusConstants.initial,
    activeOptionId: sortbyOptions[0].optionId,
    activeCategoryId: "",
    searchInput: "",
    activeRatingId: 1,
  };

  componentDidMount() {
    this.getProducts();
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    });
    const jwtToken = Cookies.get("jwt_token");
    const { activeOptionId, activeCategoryId, searchInput, activeRatingId } =
      this.state;
    const apiUrl = `http://localhost:4000/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchInput}&rating=${activeRatingId}`;
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: "GET",
    };
    const response = await fetch(apiUrl, options);
    if (response.ok) {
      const fetchedData = await response.json();
      this.setState({
        productsList: fetchedData,
        apiStatus: apiStatusConstants.success,
      });
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      });
    }
  };

  changeSortby = (activeOptionId) => {
    this.setState({ activeOptionId }, this.getProducts);
  };

  clearFilters = () => {
    this.setState(
      {
        searchInput: "",
        activeCategoryId: "",
        activeRatingId: 1,
      },
      this.getProducts
    );
  };

  changeRating = (activeRatingId) => {
    this.setState({ activeRatingId }, this.getProducts);
  };

  changeCategory = (activeCategoryId) => {
    this.setState({ activeCategoryId }, this.getProducts);
  };

  enterSearchInput = () => {
    this.getProducts();
  };

  changeSearchInput = (searchInput) => {
    this.setState({ searchInput });
  };

  renderFailureView = () => (
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
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  );

  renderProductsListView = () => {
    const { productsList, activeOptionId } = this.state;
    const shouldShowProductsList = productsList.length > 0;

    return shouldShowProductsList ? (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map((product) => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-products-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          className="no-products-img"
          alt="no products"
        />
        <h1 className="no-products-heading">No Products Found</h1>
        <p className="no-products-description">
          We could not find any products. Try other filters.
        </p>
      </div>
    );
  };

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  );

  renderAllProducts = () => {
    const { apiStatus } = this.state;

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsListView();
      case apiStatusConstants.failure:
        return this.renderFailureView();
      case apiStatusConstants.inProgress:
        return this.renderLoadingView();
      default:
        return null;
    }
  };

  render() {
    const { activeCategoryId, searchInput } = this.state;

    return (
      <div className="all-products-section">
        <FiltersGroup
          searchInput={searchInput}
          categoryOptions={categoryOptions}
          changeSearchInput={this.changeSearchInput}
          enterSearchInput={this.enterSearchInput}
          activeCategoryId={activeCategoryId}
          changeCategory={this.changeCategory}
          changeRating={this.changeRating}
          clearFilters={this.clearFilters}
        />
        {this.renderAllProducts()}
      </div>
    );
  }
}

export const ProductsHeader = (props) => {
  const onChangeSortby = (event) => {
    const { changeSortby } = props;
    changeSortby(event.target.value);
  };

  const { sortbyOptions, activeOptionId } = props;
  return (
    <div className="products-header">
      <h1 className="products-list-heading">All Products</h1>
      <div className="sort-by-container">
        <BsFilterRight className="sort-by-icon" />
        <p className="sort-by">Sort by</p>
        <select
          className="sort-by-select"
          value={activeOptionId}
          onChange={onChangeSortby}
        >
          {sortbyOptions.map((eachOption) => (
            <option
              key={eachOption.optionId}
              value={eachOption.optionId}
              className="select-option"
            >
              {eachOption.displayText}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export const ProductCard = (props) => {
  const { productData } = props;
  const { title, brand, imageUrl, rating, price, id } = productData;

  return (
    <Link to={`/shop/${id}`} className="link-item">
      <li className="product-item">
        <img src={imageUrl} alt="product" className="thumbnail" />
        <h1 className="title">{title}</h1>
        <p className="brand">by {brand}</p>
        <div className="product-details">
          <p className="price">Rs {price}/-</p>
          <div className="rating-container">
            <p className="rating">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star"
            />
          </div>
        </div>
      </li>
    </Link>
  );
};

export const FiltersGroup = (props) => {
  const renderCategoriesList = () => {
    const { categoryOptions } = props;

    return categoryOptions.map((category) => {
      const { changeCategory, activeCategoryId } = props;
      const onClickCategoryItem = () => changeCategory(category.categoryId);
      const isActive = category.categoryId === activeCategoryId;
      const categoryClassName = isActive
        ? `category-name active-category-name`
        : `category-name`;

      return (
        <li
          className="category-item"
          key={category.categoryId}
          onClick={onClickCategoryItem}
        >
          <p className={categoryClassName}>{category.name}</p>
        </li>
      );
    });
  };

  const renderProductCategories = () => (
    <>
      <h1 className="category-heading">Category</h1>
      <ul className="categories-list">{renderCategoriesList()}</ul>
    </>
  );

  const onEnterSearchInput = (event) => {
    const { enterSearchInput } = props;
    if (event.key === "Enter") {
      enterSearchInput();
    }
  };

  const onChangeSearchInput = (event) => {
    const { changeSearchInput } = props;
    changeSearchInput(event.target.value);
  };

  const renderSearchInput = () => {
    const { searchInput } = props;
    return (
      <div className="search-input-container">
        <input
          value={searchInput}
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={onChangeSearchInput}
          onKeyDown={onEnterSearchInput}
        />
        <BsSearch className="search-icon" />
      </div>
    );
  };

  const { clearFilters } = props;

  return (
    <div className="filters-group-container">
      {renderSearchInput()}
      {renderProductCategories()}
      <button
        type="button"
        className="clear-filters-btn"
        onClick={clearFilters}
      >
        Clear Filters
      </button>
    </div>
  );
};
