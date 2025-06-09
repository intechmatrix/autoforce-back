import { Router } from "express";
import { categoryController } from "../controller/index.js";
import { isAuthorize } from "../middleware/isAuthorize.js";
import upload from "../middleware/uploadFile.js";



const categoryRouter = Router();

categoryRouter.route("/create").post(isAuthorize, upload.single('featured_image'), categoryController.createCategory);


categoryRouter.route("/viewAll").get(categoryController.viewAllCategories);


categoryRouter.route("/view/:id").get(categoryController.viewCategory);


categoryRouter.route("/update/:id").patch(isAuthorize, upload.single('featured_image'), categoryController.updateCategory);


categoryRouter.route("/delete/:id").delete(isAuthorize, categoryController.deleteCategory);

categoryRouter.route("/deleteAll").delete(isAuthorize, categoryController.deleteAllCategories);


export default categoryRouter;

