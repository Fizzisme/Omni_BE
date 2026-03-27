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


export const adminController = {
    getMyProfile,
}