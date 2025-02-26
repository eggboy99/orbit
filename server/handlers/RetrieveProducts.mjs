import Products from "../models/Products.mjs"

export const RetrieveProducts = async (req, res, next) => {
    const products = await Products.find({});
    const baseUrl = "http://localhost:3000";
    const productsWithImageUrls = products.map((product) => {
        const productObj = product.toObject();
        productObj.productImages = productObj.productImages.map((imageId) => {
            return `${baseUrl}/api/explore/images/${imageId}`;
        });
        return productObj;
    });
    return res.status(200).json({
        success: true,
        products: productsWithImageUrls,
    })
}