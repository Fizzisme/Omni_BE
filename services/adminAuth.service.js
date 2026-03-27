import ApiError from "../utils/ApiError.js";
import {StatusCodes} from "http-status-codes";
import {userModel} from "../models/user.model.js";
import {JwtProvider} from "../providers/JwtProvider.js";
import {env} from "../config/environment.js";
import bcrypt from "bcrypt";


const issueTokens = async (user) => {
    const payload = {
        _id: user._id,
        role: user.role,
    };

    const accessToken = await JwtProvider.generateToken(
        payload,
        env.ACCESS_TOKEN_SECRET_SIGNATURE,
        env.ACCESS_TOKEN_LIFE,
    );

    const refreshToken = await JwtProvider.generateToken(
        payload,
        env.REFRESH_TOKEN_SECRET_SIGNATURE,
        env.REFRESH_TOKEN_LIFE,
    );

    return { accessToken, refreshToken };
};

const login = async (email, password) => {
    const user = await userModel.findByEmail(email);

    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Thông tin đăng nhập không hợp lệ');
    }

    const localProvider = user.authProviders?.find((p) => p.type === 'LOCAL');
    if (!localProvider) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Thông tin đăng nhập không hợp lệ');
    }

    const isPasswordValid = bcrypt.compareSync(password, localProvider.passwordHash);
    if (!isPasswordValid) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Thông tin đăng nhập không hợp lệ');
    }
    if (user.role !== userModel.USER_ROLES.ADMIN) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'Không có quyền truy cập khu vực admin');
    }
    return issueTokens(user);

}



export const adminAuthService = {
    login
}