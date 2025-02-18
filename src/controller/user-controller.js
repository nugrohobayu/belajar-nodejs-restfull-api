import userService from "../service/user-service.js";

const register = async (req, res, next) => {
    try {
        const result = await userService.register(req.body);
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);

    }
}

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const get = async (req, res, next)=>{
    try {
        const username = req.user.username;
        const result = await userService.getUser(username);
        res.status(200).json({
            data:result
        });
    } catch (error) {
        next(error);
    }
}
export default {
    register,
    login,
    get
}