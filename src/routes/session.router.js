import { Router } from 'express';
import passport from 'passport';
import { UsersService } from '../services/users.service.js';
import UserDTO from '../DTOs/user.dto.js';
import { getUserFromSession } from '../middlewares/auth.js';
import { logger } from '../utils/logger.js';

export const sessionRouter = Router();

const usersService = new UsersService();

sessionRouter.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req, res) => {})

sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res) => {
    logger.debug(req.user);
    req.session.firstName = req.user.firstName;
    req.session.lastName = req.user.lastName;
    req.session.email = req.user.email;
    req.session.role = req.user.role;
    req.session.cartId = req.user.cart;
    res.redirect('/products');
});

sessionRouter.get('/current', async (req, res) => {
    const user = getUserFromSession(req);
    if(!!user){
        const user = await usersService.getUserById(req.session.passport.user);
        const userDTO = new UserDTO(user[0]);
        logger.debug(userDTO);
        return res.status(200).json(userDTO);
    } else {
        return res.status(404).json({
            error: "User not found",
            message: "The user saved in the current session was not found."
        })
    }
})
