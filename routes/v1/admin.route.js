import express from 'express';
import {orderController} from "../../controllers/order.controller.js";
import {verifyToken} from "../../middleware/verifyToken.js";
import {authorizeRoles} from "../../middleware/authorizeRoles.js";
import {adminController} from "../../controllers/admin.controller.js";

const Router = express.Router();
Router.use(verifyToken, authorizeRoles('ADMIN'));

Router.patch('/orders/:orderId', orderController.update)

Router.get('/orders/revenue', orderController.getRevenueByMonth)

Router.get('/me', adminController.getMyProfile)

export const adminRoute = Router;