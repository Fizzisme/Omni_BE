import express from 'express';
import {authRoute} from "./auth.route.js";
import {productRoute} from "./product.route.js";
import {categoryRoute} from "./category.route.js";
import {orderRoute} from "./order.route.js";
import {adminRoute} from "./admin.route.js";
import {adminAuthRoute} from "./adminAuth.route.js";
import {userRoute} from "./user.route.js";
const Router = express.Router();

Router.use('/auth', authRoute)

Router.use('/categories', categoryRoute)

Router.use('/products', productRoute)

Router.use('/orders', orderRoute)

Router.use('/admins', adminRoute)

Router.use('/auth/admins', adminAuthRoute)

Router.use('/users', userRoute)

export const APIs_V1 = Router;