import express from "express";
import {authValidation} from "../../validations/auth.validation.js";
import {authController} from "../../controllers/auth.controller.js";


const Router = express.Router();

Router.post('/send-verify-code',authValidation.sendVerifyCode, authController.sendVerifyCode);

Router.post('/verify-code', authValidation.verifyCode, authController.verifyCode)

Router.post('/sign-up', authValidation.signUp, authController.signUp)

Router.post('/sign-in', authValidation.signIn, authController.signIn);

export const authRoute = Router;