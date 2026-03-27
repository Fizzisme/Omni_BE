import {adminAuthService} from "../services/adminAuth.service.js";
import ms from "ms";

const login = async (req, res, next) => {
    try {
        const result = await adminAuthService.login(req.body.email, req.body.password);
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
    }
    catch (err) {
        next(err);
    }
}


export const adminAuthController = {
    login
}