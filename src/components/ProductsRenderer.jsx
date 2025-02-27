import { useEffect, useState, useContext, useMemo } from "react";
import styles from "../assets/css/ProductsRenderer.module.css";
import AuthenticationContext from "../context/AuthenticationContext";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ProductsRenderer = ({
  searchValue,
  categorySelection,
  locationSelection,
  conditionSelection,
}) => {
  const [products, setProducts] = useState([]);

  const { user, checkAuthStatus } = useContext(AuthenticationContext);
  checkAuthStatus();

  const handleSaveProduct = (productID) => {
    const data = { user: user, product: productID };
    const isProductSaved = products.find(
      (element) =>
        element._id === productID &&
        element.saved.find((userId) => userId === user)
    );

    if (!isProductSaved) {
      data.save = true;
    }

    const saveProduct = async () => {
      await fetch("http://localhost:3000/api/explore/save-product", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          if (product._id === productID) {
            if (data.save) {
              // Add the user if not already in the saved array
              return {
                ...product,
                saved: [...product.saved, user],
              };
            } else {
              // Remove the user from the saved array
              return {
                ...product,
                saved: product.saved.filter((userId) => userId !== user),
              };
            }
          }
          return product;
        })
      );
    };

    saveProduct();
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const request = await fetch(
        "http://localhost:3000/api/explore/retrieve-products",
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const response = await request.json();
      setProducts(response.products);
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      const matchesCategory =
        categorySelection === "Choose Category" ||
        product.category === categorySelection;

      const matchesLocation =
        locationSelection === "Choose Location" ||
        product.location === locationSelection;

      const matchesCondition =
        !conditionSelection || product.condition === conditionSelection;

      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchValue.toLowerCase());

      return (
        matchesCategory && matchesLocation && matchesCondition && matchesSearch
      );
    });
  }, [
    products,
    searchValue,
    categorySelection,
    locationSelection,
    conditionSelection,
  ]);

  const navigate = useNavigate();
  const handleProductNavigation = (productId) => {
    navigate(`/explore/product/${productId}`);
  };

  return (
    <div className={styles.productsContainer}>
      {products != null &&
        filteredProducts.map((product) => (
          <div
            key={product._id}
            className={styles.productContainer}
            onClick={() => handleProductNavigation(product._id)}
          >
            <img
              className={styles.productImage}
              src={product.productImages[product.productImages.length - 1]}
              alt="Product Image"
            />
            <div className={styles.nameContainer}>
              <h2 className={styles.productName}>{product.name}</h2>
              <div className={styles.savedContainer}>
                <p>{product.saved.length}</p>
                {product.saved.find((userId) => userId === user) ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.bookmark}
                    viewBox="0 -960 960 960"
                    fill="#fcbf49"
                    onClick={() => handleSaveProduct(product._id)}
                  >
                    <path d="M200-120v-665q0-24 18-42t42-18h440q24 0 42 18t18 42v665L480-240 200-120Z" />
                  </svg>
                ) : (
                  <svg
                    className={styles.bookmark}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    fill="#222222"
                    onClick={() => handleSaveProduct(product._id)}
                  >
                    <path d="M200-120v-665q0-24 18-42t42-18h440q24 0 42 18t18 42v665L480-240 200-120Zm60-91 220-93 220 93v-574H260v574Zm0-574h440-440Z" />
                  </svg>
                )}
              </div>
            </div>

            <p
              className={`${styles.productCondition} ${
                product.condition === "New"
                  ? styles.new
                  : product.condition === "Like new"
                  ? styles.likeNew
                  : product.condition === "Well used"
                  ? styles.wellUsed
                  : ""
              }`}
            >
              {product.condition}
            </p>
            <p className={styles.productLocation}>{product.location}</p>
          </div>
        ))}
    </div>
  );
};

ProductsRenderer.propTypes = {
  searchValue: PropTypes.string,
  categorySelection: PropTypes.string,
  locationSelection: PropTypes.string,
  conditionSelection: PropTypes.string,
};

export default ProductsRenderer;
