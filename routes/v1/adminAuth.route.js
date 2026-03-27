import express from "express";
import {adminAuthController} from "../../controllers/adminAuth.controller.js";

const Router = express.Router();

Router.post('/login', adminAuthController.login);


export const adminAuthRoute = Router;