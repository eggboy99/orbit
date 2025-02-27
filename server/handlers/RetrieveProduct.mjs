import Products from "../models/Products.mjs"

export const RetrieveProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;
        let product = await Products.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            })
        }

        const baseUrl = "http://localhost:3000";
        product = product.toObject();
        product.productImages = product.productImages.map((imageId) => {
            return `${baseUrl}/api/explore/images/${imageId}`;
        });

        res.status(200).json({ success: true, product });
    } catch (error) {
        console.log('Error while retrieving product details: ', error);
    }
}