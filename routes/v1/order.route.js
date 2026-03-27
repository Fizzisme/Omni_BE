import express from "express";
import {orderController} from "../../controllers/order.controller.js";

const Router = express.Router();

Router
    .get("/", orderController.getAll)
    .get("/:id", orderController.getById)
    .post("/", orderController.create);

export const orderRoute = Router;