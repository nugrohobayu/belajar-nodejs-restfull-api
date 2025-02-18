import { prismaClient } from "../application/database.js";
import { ResponseError } from "../response_error/response_error.js";
import { getUserValidation, loginUserValidation, regisUserValidation } from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const register = async (request) => {
    const user = validate(regisUserValidation, request);

    const countUser = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (countUser == 1) {
        throw ResponseError(400, "Username already exists")
    }

    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.user.create({
        data: user,
        select: {
            username: true,
            name: true,
        }
    })

}

const login = async (request) => {
    const loginReq = validate(loginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            username: loginReq.username
        },
        select: {
            username: true,
            password: true
        }
    });
    if (!user) {
        throw new ResponseError(401, "Username or password wrong")
    }
    const isPasswordValid = await bcrypt.compare(loginReq.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "username or password wrong");
    }

    const token = uuid().toString();
    return prismaClient.user.update({
        data: {
            token: token
        },
        where: {
            username: user.username
        },
        select: {
            token: true
        }
    });

}

const getUser = async (username) => {
    username = validate(getUserValidation, username);

    const user = await prismaClient.user.findUnique({
        where: {
            username: username,
        },
        select: {
            username: true,
            name: true,
        }
    })
    if (!user) {
        throw new ResponseError(401, "User not found");
    }
    return user;
}

export default {
    register,
    login,
    getUser
}