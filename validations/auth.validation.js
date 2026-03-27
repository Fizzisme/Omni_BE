// src/validations/authValidation
import { z } from 'zod';
import { zodValidate } from '../utils/zodValidate.js';

// Tạo Schema SignUp
const sendVerifyCodeSchema = z.object({
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email không hợp lệ'),
});

// Tạo Schema signIn
const signInSchema = z.object({
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email không hợp lệ'),
    password: z.string().min(8),
});

const verifyCodeSchema = z.object({
    code: z.string().trim().length(6).regex(/^\d+$/, "Code must be 6 digits"),
})

const signUpSchema = z.object({
    password: z.string().min(8),
})

// Trả về các hàm
const sendVerifyCode = zodValidate(sendVerifyCodeSchema);

const signIn = zodValidate(signInSchema);

const verifyCode = zodValidate(verifyCodeSchema);

const  signUp = zodValidate(signUpSchema);

export const authValidation = {
    sendVerifyCode,
    signIn,
    verifyCode,
    signUp
};
