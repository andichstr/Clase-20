import { Router } from 'express';
import { UsersService } from '../services/users.service.js';
import { logger } from '../utils/logger.js';
import CustomResponse from '../exceptions/custom.response.js';

export const userRouter = Router();

const usersService = new UsersService();

userRouter.get('/premium/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await usersService.makePremium(uid);
        if (!!user) {
            return res.status(200).json(user);
        } else {
            return res.status(400).json(new CustomResponse(
                "The role was not user",
                400,
                "Bad Request"
            ));
        }
    } catch (e) {
        logger.error(e);
        return res.status(500).json(new CustomResponse(
            `There was an unexpected error. Stacktrace: ${e}`,
            500,
            "Internal Error."
        ))
    }
})
