import express from 'express';

import {verifyToken} from "../../middleware/verifyToken.js";
import {authorizeRoles} from "../../middleware/authorizeRoles.js";
import {userController} from "../../controllers/user.controller.js";
import {orderController} from "../../controllers/order.controller.js";

const Router = express.Router();
Router.use(verifyToken, authorizeRoles('CUSTOMER'));

Router.get('/me', userController.getMyProfile)
Router.get('/my-orders', orderController.getMyOrders)
Router.get('/my-orders/:id', orderController.getMyOrder);
Router.patch('/',userController.update)

export const userRoute = Router;