import { Router } from "express";
import { RetrieveCategories } from "../handlers/RetrieveCategories.mjs";
import { RetrieveLocations } from "../handlers/RetrieveLocations.mjs";
import { ProductUpload } from "../handlers/ProductUpload.mjs";
import { RetrieveProducts } from "../handlers/RetrieveProducts.mjs";
import { RetrieveProduct } from "../handlers/RetrieveProduct.mjs";
import mongoose from "mongoose";
import { gfs } from "../config/gridfs-setup.mjs";
import { SaveProduct } from "../handlers/SaveProduct.mjs";

const exploreRouter = Router();

exploreRouter.get("/explore/retrieve-categories", RetrieveCategories);
exploreRouter.get('/explore/retrieve-locations', RetrieveLocations);
exploreRouter.get('/explore/retrieve-products', RetrieveProducts);
exploreRouter.get('/explore/retrieve-product/:id', RetrieveProduct);
exploreRouter.get('/explore/images/:id', async (req, res) => {
    try {
        const fileId = new mongoose.Types.ObjectId(req.params.id);
        const downloadStream = gfs.openDownloadStream(fileId);

        // Connect the donwload stream directly to the HTTP response
        downloadStream.pipe(res).on('error', (error) => {
            console.log('Image not found: ', error);
        })
    } catch (error) {
        console.log(error);
    }
})

exploreRouter.post('/explore/upload-product', ProductUpload);
exploreRouter.post('/explore/save-product', SaveProduct);

export default exploreRouter;