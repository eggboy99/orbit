import { Router } from "express";
import { RetrieveCategories } from "../handlers/RetrieveCategories.mjs";
import { RetrieveLocations } from "../handlers/RetrieveLocations.mjs";
import { ProductUpload } from "../controllers/ProductUpload.mjs";

const exploreRouter = Router();

exploreRouter.get("/explore/retrieve-categories", RetrieveCategories);
exploreRouter.get('/explore/retrieve-locations', RetrieveLocations);
exploreRouter.post('/explore/upload-product', ProductUpload);

export default exploreRouter;