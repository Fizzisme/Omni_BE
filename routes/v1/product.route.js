import express from "express";
import {productController} from "../../controllers/product.controller.js";

const Router = express.Router();

Router.get('/',productController.getAll)
Router.get('/:categorySlug', productController.getProductsByCategory)


export const productRoute = Router;