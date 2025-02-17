import bcrypt from 'bcrypt';
import User from "../models/User.js"
import generateToken from '../utils/authUtils.js';

export default {
    async register(userData) {
        if (userData.password !== userData.confirmPassword) {
            throw new Error('Password missmatch');
        }

        //Select and return only user id , no need all data .
        const user = await User.findOne({ email: userData.email }).select({ _id: true });
        if (user) {
            throw new Error('User already exists');
        }
        const createdUser = await User.create(userData);

        const token = generateToken(createdUser);
        return token;
    },
    async login(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            throw new Error('Invalid email or password');
        }

        const token = generateToken(user);
        return token;
    },
}

