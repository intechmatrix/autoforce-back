import { Router } from "express";
import { productController } from "../controller/index.js";
import { isAuthorize } from "../middleware/isAuthorize.js";
import upload from "../middleware/uploadFile.js";



const productRouter = Router();

productRouter.route("/create").post(
    isAuthorize,
     upload.fields([
        { name: 'photo_1', maxCount: 1 },
        { name: 'photo_2', maxCount: 1 },
        { name: 'photo_3', maxCount: 1 },
        { name: 'photo_4', maxCount: 1 },
        { name: 'photo_5', maxCount: 1 },
     ]),
        productController.createProduct);


productRouter.route("/viewAll").get(productController.viewAllProducts);




productRouter.route("/view/:id").get(productController.viewProduct);

productRouter.route("/viewbyCategory/:category_title").get(productController.viewProductByCategory);



productRouter.route("/update/:id").patch(isAuthorize,
     upload.fields([
        { name: 'photo_1', maxCount: 1 },
        { name: 'photo_2', maxCount: 1 },
        { name: 'photo_3', maxCount: 1 },
        { name: 'photo_4', maxCount: 1 },
        { name: 'photo_5', maxCount: 1 },
     ]),
        productController.updateProduct
    );

productRouter.route("/delete/:id").delete(isAuthorize, productController.deleteProduct);


productRouter.route("/deleteAll").delete(isAuthorize, productController.deleteAllProducts);

productRouter.route("/slug/:product_slug").get(productController.getProductDetails);


export default productRouter;

