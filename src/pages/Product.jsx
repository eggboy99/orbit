import NavigationBar from "../components/NavigationBar";
import AuthenticationContext from "../context/AuthenticationContext";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../assets/css/Product.module.css";
import DateConversion from "../utils/DateConversion.mjs";
import { RetrieveUserDetails } from "../utils/RetrieveUserDetails.mjs";
import UserRating from "../components/UserRating";

const Product = () => {
  const { checkAuthStatus } = useContext(AuthenticationContext);
  checkAuthStatus();

  const product = useParams();

  const [productDetails, setProductDetails] = useState({});

  let productUploadedDate;
  if (productDetails.date) {
    productUploadedDate = DateConversion(productDetails.date);
  }

  useEffect(() => {
    const fetchProductData = async () => {
      const request = await fetch(
        `http://localhost:3000/api/explore/retrieve-product/${product.id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const response = await request.json();
      setProductDetails(response.product);
    };

    fetchProductData();
  }, [setProductDetails, product.id]);

  const [mainImageUrl, setMainImageUrl] = useState(null);

  useEffect(() => {
    if (
      productDetails.productImages &&
      productDetails.productImages.length > 0 &&
      !mainImageUrl
    ) {
      const reversedImages = productDetails.productImages.slice().reverse();
      setMainImageUrl(reversedImages[0]);
    }
  }, [productDetails, mainImageUrl]);

  const handleSetMainImage = (index) => {
    const reversedImages = productDetails.productImages.slice().reverse();
    for (let i = 0; i < reversedImages.length; ++i) {
      if (index === i) {
        setMainImageUrl(reversedImages[i]);
      }
    }
  };

  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (Object.keys(productDetails).length !== 0) {
        const user = await RetrieveUserDetails(productDetails.user);
        setUserDetails(user);
      }
    };

    fetchUserData();
  }, [setUserDetails, productDetails]);

  return (
    <>
      <NavigationBar />
      <main className={styles.productContainer}>
        <div className={styles.imagesContainer}>
          {mainImageUrl && (
            <img
              src={mainImageUrl}
              alt="Product Main Image"
              className={styles.productMainImage}
            />
          )}
          <div className={styles.subImagesContainer}>
            {Object.keys(productDetails).length !== 0 &&
              productDetails.productImages
                .slice()
                .reverse()
                .map((image, index) => (
                  <img
                    src={image}
                    key={index}
                    className={`${styles.productImage} ${
                      image === mainImageUrl ? styles.selected : ""
                    }`}
                    onClick={() => handleSetMainImage(index)}
                  />
                ))}
          </div>
        </div>
        <div className={styles.productDetailsContainer}>
          <div className={styles.userContainer}>
            <img
              src={userDetails && userDetails.userProfileImage}
              alt="User Profile Image"
              className={styles.userProfileImage}
            />
            <div>
              <p>{userDetails && userDetails.username}</p>
              <UserRating userRating={userDetails && userDetails.rating} />
            </div>
          </div>
          <div className={styles.productDetails}>
            <h1 className={styles.productName}>{productDetails.name}</h1>
            <h2
              className={`${styles.productCondition} ${
                productDetails.condition === "New"
                  ? styles.new
                  : productDetails.condition === "Like new"
                  ? styles.likeNew
                  : productDetails.condition === "Well used"
                  ? styles.wellUsed
                  : ""
              }`}
            >
              {productDetails.condition}
            </h2>
            <p>{productDetails.description}</p>
            <div className={styles.locationCategoryDateContainer}>
              <div className={styles.locationContainer}>
                <h2>Location</h2>
                <h3>{productDetails.location}</h3>
              </div>
              <div className={styles.categoryContainer}>
                <h2>Category</h2>
                <h3>{productDetails.category}</h3>
              </div>
              <div className={styles.dateContainer}>
                <h2>Listed on</h2>
                <h3>{productUploadedDate}</h3>
              </div>
            </div>
          </div>
          <button type="submit" className={styles.enquireButton}>
            Enquire
          </button>
        </div>
      </main>
    </>
  );
};

export default Product;
