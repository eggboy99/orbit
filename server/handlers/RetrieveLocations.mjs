import Locations from "../models/Locations.mjs"

export const RetrieveLocations = async (req, res, next) => {
    try {
        const locations = await Locations.find({});
        return res.status(200).json({
            success: true,
            towns: locations,
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error,
        })
    }
}