import { Router } from 'express';
import passport from 'passport';

const registerRouter = Router();

registerRouter.post('/', passport.authenticate('register', {failureRedirect:'/register/failregister'}), async (req, res) => {
  return res.redirect('/login');
});

registerRouter.get('/failregister', async (req, res) => {
  return res.status(400).render('errorPage', { msg: 'Error registrando al usuario' });
})

registerRouter.get('/', async (req, res) => {
    return res.status(200).render('register');
})

export default registerRouter;