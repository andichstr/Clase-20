import { Router } from 'express';
import passport from 'passport';


const loginRouter = Router();

loginRouter.post('/', passport.authenticate('login', { failureRedirect:'/login/faillogin' }), async (req, res) => {
  if(!req.user) return res.status(400).render('errorPage', { msg: 'Invalid credentials' });
  req.session.firstName = req.user.firstName;
  req.session.lastName = req.user.lastName;
  req.session.email = req.user.email;
  req.session.role = req.user.role;
  req.session.cartId = req.user.cartId;
  return res.redirect('/');
});

loginRouter.get('/faillogin', (req, res) => {
  res.status(400).render('errorPage', { msg: 'Unexpected error doing login' })
})

loginRouter.get('/', async (req, res) => {
  if (!req.session.email) {
    res.status(200).render('login');
  } else {
    res.redirect('/products');
  }
})

export default loginRouter;