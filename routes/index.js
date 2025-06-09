import { Router } from "express";
import userRouter from "./userRoute.js";
import uploadFilesRouter from "./uploadFilesRoute.js";
import categoryRouter from "./categoryRoute.js";
import productRouter from "./productRoute.js";


const apiRouter = Router();

const routePath = [
    {
        path: "/user",
        router: userRouter,
    },
    
    {
        path: "/file",
        router: uploadFilesRouter,
    },

    {
        path: "/category",
        router: categoryRouter,
    },

    {
        path: "/products",
        router: productRouter,
    },

    

   

];

routePath.forEach((route) => {
    apiRouter.use(route.path, route.router);
});

export default apiRouter;

