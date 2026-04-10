import {StatusCodes} from "http-status-codes";
import {userService} from "../services/user.service.js";

const getMyProfile = async (req, res, next) => {
    try {
        const result = await userService.getMyProfile(req.user);
        res.status(StatusCodes.OK).json(result);
    } catch (err) {
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        const result = await userService.update(req.body);
        res.status(StatusCodes.OK).json(result);
    } catch(err) {
        next(err);
    }
}

const getUserById = async (req, res, next) => {
    try {
        console.log(req.params.id);
        const result = await userService.getUserById(req.params.id);
        res.status(StatusCodes.OK).json(result);
    } catch (err) {
        next(err);
    }
}


export const userController = {
    getMyProfile,
    update,
    getUserById
}