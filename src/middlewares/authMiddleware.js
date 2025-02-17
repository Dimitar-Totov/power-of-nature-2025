import jwt from 'jsonwebtoken';
import { AUTH_COOKIE_NAME } from "../config/authCookie.js";
import { JWT_SECRET } from '../config/secret.js';

export const auth = (req, res, next) => {
    const token = req.cookies[AUTH_COOKIE_NAME];

    if (!token) {
        return next();
    }

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        req.user = decodedToken;
        res.locals.user = decodedToken;
    } catch (err) {
        res.clearCookie(AUTH_COOKIE_NAME);
        return res.redirect('/auth/login');
    }
    next();
}

export const isAuth = (req, res, next) => {
    const user = req.user;
    if(!user){
        return res.redirect('/auth/login');
    }
    next();
};

export const isGuest = (req,res,next) => {
    const user = req.user;
    if(user){
        return res.redirect('/');
    }
    next();
}