import ApiError from "../utils/ApiError.js";
import {StatusCodes} from "http-status-codes";
import {userModel} from "../models/user.model.js";


const getMyProfile = async (user) => {
    // Kiểm tra xem đã có tài khoản chưa
    const userExisted = await userModel.findById(user._id);
    if (!userExisted) throw new ApiError(StatusCodes.NOT_FOUND, 'Không có tài khoản');


    return {
        _id: userExisted._id,
        email: userExisted.authProviders[0].email,
        role: userExisted.role,
        createdAt: userExisted.createdAt,
        address: userExisted?.address || "",
        phoneNumber: userExisted?.phoneNumber || "",
        age: userExisted?.age || "",
        firstName: userExisted?.firstName || "",
        lastName: userExisted?.lastName || "",
        gender: userExisted?.gender || "",
    };
};

const update = async (user) => {
    const userExisted = await userModel.findById(user._id);
    if(!userExisted) throw new  ApiError(StatusCodes.NOT_FOUND,"Khong tim thay")

    const data = {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        address: user.address,
        gender: user.gender,
        age: user.age,
    }

    return await userModel.update(user._id, data)
}



export const userService = {
    getMyProfile,
    update,
}