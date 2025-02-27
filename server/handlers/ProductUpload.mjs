import Products from "../models/Products.mjs"
import { uploadImage } from "../config/gridfs-setup.mjs";

export const ProductUpload = async (req, res, next) => {
    const { images, productName, productDescription, category, location, condition, userId } = req.body;

    const productImageIds = await Promise.all(
        images.map(async (image, index) => {
            const imageBuffer = Buffer.from(
                image.replace(/^data:image\/\w+;base64,/, ''),
                'base64'
            );

            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const day = now.getDate();
            const date = `${day}/${month}/${year}`;
            const imageName = `${index + 1}: ${productName}-${userId} ${date}`;

            return await uploadImage(imageName, imageBuffer, {
                type: 'product',
                user: userId,
            });
        })
    );
    const newProduct = new Products({
        user: userId,
        name: productName,
        description: productDescription,
        category,
        location,
        condition,
        productImages: productImageIds,
    });

    try {
        await newProduct.save();
        return res.status(200).json({
            success: true,
            message: 'Product upload successfully!',
            body: newProduct,
        })
    } catch (error) {
        console.log(error);
    }
};