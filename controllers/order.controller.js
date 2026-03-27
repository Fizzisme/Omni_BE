import {StatusCodes} from "http-status-codes";
import {orderService} from "../services/order.service.js";
import {formatRevenue} from "../utils/formatRevenue.js";


const getAll = async (req, res, next) => {
    try {
        const result = await orderService.getAll();
        res.status(StatusCodes.OK).json(result);
    }
    catch (error) {
        next(error);
    }
}

const create = async (req, res, next) => {
    try {
        const result = await orderService.create(req.body);
        res.status(StatusCodes.CREATED).json(result);
    }
    catch (err) {
        next(err);
    }
}

const getById = async (req, res, next) => {
    try {
        const result = await orderService.getById(req.params.id);
        res.status(StatusCodes.OK).json(result);
    }
    catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        console.log("HI")
        const result = await orderService.update(req.params.orderId, req.body);
        res.status(StatusCodes.OK).json(result);
    }
    catch (err) {
        next(err);
    }
}

const getRevenueByMonth = async (req, res, next) => {
    try {
        const data = await orderService.getRevenueByMonth(req.query.month,req.query.year);
        const result = formatRevenue(data,req.query.month,req.query.year)
        res.status(StatusCodes.OK).json(result);
    }
    catch (err) {
        next(err);
    }
}

const getMyOrders = async (req, res, next) => {
    try {
        const result = await orderService.getMyOrders(req.user);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

const getMyOrder = async (req, res, next) => {
    try {
        const result = await orderService.getMyOrder(req.user,req.params.id);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}


export const orderController = {
    getAll,
    create,
    getById,
    update,
    getRevenueByMonth,
    getMyOrders,
    getMyOrder
}