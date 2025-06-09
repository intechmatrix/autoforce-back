import { Router } from "express";
import { userController } from "../controller/index.js";

const userRouter = Router();

userRouter.route("/register").post(userController.registerUser);

userRouter.route("/login").post(userController.loginUser);

export default userRouter;

