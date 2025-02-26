import Products from "../models/Products.mjs"

export const SaveProduct = async (req, res, next) => {
    const { user, product, save } = req.body;

    try {
        let updatedProduct;
        if (save === true) {
            updatedProduct = await Products.findByIdAndUpdate(
                product,
                { $addToSet: { saved: user } },
                { new: true }
            );
        } else {
            updatedProduct = await Products.findByIdAndUpdate(
                product,
                { $pull: { saved: user } },
                { new: true }
            );
        }

        return res.status(200).json({
            success: true,
            updatedProduct: updatedProduct,
        });
    } catch (error) {
        console.log(`Error ${save ? "saving" : "unsaving"} product ${product}: `, error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
