import {StatusCodes} from "http-status-codes";
import {authService} from "../services/auth.service.js";
import ms from 'ms'
const sendVerifyCode = async (req, res, next) => {
    try {
        const result = await authService.sendVerifyCode(req.body.email);

        res.cookie("otp_token", result, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 5 * 60 * 1000,
        });
        res.status(StatusCodes.CREATED).json(result);
    } catch (err) {
        next(err);
    }
};
const signIn = async (req, res, next) => {
    try {
        const result = await authService.signIn(req.body.email,req.body.password);
        // Trả về 2 cookie
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms('20 minutes'),
        });
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms('14 days'),
        });
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const verifyCode  = async (req, res, next) => {
    try {
        const token = req.cookies?.otp_token;
        const { code } = req.body;
console.log('hi')
        if (!token) {
            return res.status(400).json({ message: "OTP token not found. Please request a new code." });
        }

        await authService.verifyCode(token, code);

        return res.status(StatusCodes.OK).json({ success: true, token });
    } catch (err) {
        next(err);
    }
}

const signUp = async (req, res, next) => {
    try {
        const result = await authService.signUp(req.body.email,req.body.password);
        return res.status(StatusCodes.CREATED).json(result);
    }
    catch (err) {
        next(err);
    }
}


export const authController = {
    sendVerifyCode,
    signIn,
    verifyCode,
    signUp
}