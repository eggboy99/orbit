import Categories from "../models/Categories.mjs";

export const RetrieveCategories = async (req, res, next) => {
    try {
        const categories = await Categories.find({});
        return res.status(200).json({
            success: true,
            categories: categories
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Failed to fetch categories information"
        })
    }
}