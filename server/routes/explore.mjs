import { Router } from "express";
import { RetrieveCategories } from "../handlers/RetrieveCategories.mjs";
import { RetrieveLocations } from "../handlers/RetrieveLocations.mjs";

const exploreRouter = Router();

exploreRouter.get("/retrieve-categories", RetrieveCategories);
exploreRouter.get('/retrieve-locations', RetrieveLocations);

export default exploreRouter;