import nodemailer from 'nodemailer';
import {env} from "../config/environment.js";
import {userModel} from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import {StatusCodes} from "http-status-codes";
import {JwtProvider} from "../providers/JwtProvider.js";
import bcrypt from 'bcrypt';
import {Resend} from "resend";



const resend = new Resend(env.RESEND_API_KEY);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS,
    },
});

// const sendVerifyCode = async (email) => {
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//
//     const token = JwtProvider.generateToken(
//         {email, otp},
//         env.ACCESS_TOKEN_SECRET_SIGNATURE,
//        '5m'
//     )
//     const mailOptions = {
//         from: `"Omnicart" <${env.MAIL_USER}>`,
//         to: email,
//         subject: "Your Omnicart Verification Code",
//         html: `
//             <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
//                 <h2 style="color: #e87722;">Welcome to Omnicart!</h2>
//                 <p>Use the verification code below to complete your registration:</p>
//                 <div style="
//                     font-size: 36px;
//                     font-weight: bold;
//                     letter-spacing: 10px;
//                     color: #e87722;
//                     text-align: center;
//                     padding: 20px;
//                     background: #fff5ee;
//                     border-radius: 8px;
//                     margin: 24px 0;
//                 ">
//                     ${otp}
//                 </div>
//                 <p>This code will expire in <b>5 minutes</b> (at 5 minutes).</p>
//                 <p style="color: #999; font-size: 13px;">
//                     If you did not request this, please ignore this email.
//                 </p>
//             </div>
//         `,
//     };
//
//     await transporter.sendMail(mailOptions);
//
//
//     return token
// };
export const sendVerifyCode = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const token = JwtProvider.generateToken(
        { email, otp },
        env.ACCESS_TOKEN_SECRET_SIGNATURE,
        '5m'
    );

    await resend.emails.send({
        from: "Omnicart <onboarding@resend.dev>", // chưa có domain thì dùng cái này
        to: email,
        subject: "Your Omnicart Verification Code",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
                <h2 style="color: #e87722;">Welcome to Omnicart!</h2>
                <p>Use the verification code below to complete your registration:</p>
                <div style="
                    font-size: 36px;
                    font-weight: bold;
                    letter-spacing: 10px;
                    color: #e87722;
                    text-align: center;
                    padding: 20px;
                    background: #fff5ee;
                    border-radius: 8px;
                    margin: 24px 0;
                ">
                    ${otp}
                </div>
                <p>This code will expire in <b>5 minutes</b>.</p>
                <p style="color: #999; font-size: 13px;">
                    If you did not request this, please ignore this email.
                </p>
            </div>
        `,
    });

    return token;
};
const verifyCode = async (token,code) => {
    const {otp, email} = await JwtProvider.verifyToken(token, env.ACCESS_TOKEN_SECRET_SIGNATURE);

    if(otp !== code) throw new ApiError(StatusCodes.UNAUTHORIZED, "Your OTP is not correct");
    return email;
}

const signUp = async (email,password) => {

    const userExisted = await userModel.findByEmail(email);
    if(userExisted) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "Tài khoản đã tồn tại");

    const user = await userModel.createNew(
        {
            authProviders:[
                {
                    type: 'LOCAL',
                    email,
                    passwordHash: bcrypt.hashSync(password, 8),
                }
            ].filter(Boolean),
        }
    )
    return user._id
}

const signIn = async (email,password) => {
    const userExisted = await userModel.findByEmail(email);
    if (!userExisted) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Thông tin đăng nhập không hợp lệ');
    if (userExisted._destroy) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'Tài khoản đã bị vô hiệu hóa');
    }
    const localProvider = userExisted?.authProviders.find((p) => p.type === 'LOCAL');
    if (!localProvider) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Thông tin đăng nhập không hợp lệ');
    if (!bcrypt.compareSync(password, localProvider.passwordHash)) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Sai Mật khẩu');
    }
    const userInfo = {
        _id: userExisted._id,
        role: userExisted.role,
    };
    const accessToken = await JwtProvider.generateToken(
        userInfo,
        env.ACCESS_TOKEN_SECRET_SIGNATURE,
        env.ACCESS_TOKEN_LIFE,
    );
    const refreshToken = await JwtProvider.generateToken(
        userInfo,
        env.REFRESH_TOKEN_SECRET_SIGNATURE,
        env.REFRESH_TOKEN_LIFE,
    );

    return {
        accessToken,
        refreshToken,
    };
}

export const authService = {
    sendVerifyCode,
    verifyCode,
    signUp,
    signIn,
}