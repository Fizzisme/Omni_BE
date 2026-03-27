import express from "express";
import {categoryController} from "../../controllers/category.controller.js";

const Router = express.Router();

Router.get('/:slug', categoryController.getCategoriesBySlug)
    .get('/', categoryController.getAll)


export const categoryRoute = Router;