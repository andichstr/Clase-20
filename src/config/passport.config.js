import passport from "passport";
import local from 'passport-local';
import jwt from 'passport-jwt';
import { UsersRepository } from "../daos/factory.js";
import { CartService } from "../services/carts.service.js";
import { createHash, isValidPassword } from "../utils/encript.js";
import GitHubStrategy from 'passport-github2';
import { logger } from "../utils/logger.js";

const usersRepository = new UsersRepository();
const cartService = new CartService();

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['secret']
    }
    return token;
}

const initializePassport = () => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.SECRET_KEY
    }, async(jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch(error) {
            return done(error);
        }
    }));
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { firstName, lastName, email, age } = req.body;
            try {
                let user = await usersRepository.getByEmail({ email: username });
                logger.debug(user);
                if (user) {
                    logger.info("User already exists");
                    return done(null, false);
                }
                const cart = await cartService.addCart();
                const result = await usersRepository.create({ firstName, lastName, age, email, password:createHash(password), cart: cart._id });
                req.session.firstName = result.firstName;
                req.session.email = result.email;
                req.session.role = result.role;
                req.session.cartId = result.cart;
                return done(null, result);
            } catch (error) {
                return done("Error al obtener el usuario: " + error);
            } 
        }
    ))
    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        logger.debug(`user: ${username} password: ${password}`);
        if (username == "adminCoder@coder.com" && password == "adminCod3r123") {
            const user = {
                firstName: "admin",
                lastName: "admin",
                email: username,
                role: "admin",
                cartId: "648dea4594df99a1170ce143"
            }
            return done(null, user);
        }
        try {
            const user = await usersRepository.getByEmail({email: username});
            logger.debug(`logged user password: ${user} password: ${password}`);
            if (!user) {
                logger.info("User doesn't exist");
                return done(null, false);
            }
            if (!isValidPassword(user, password)) return done(null, false);
            delete user.password;
            return done(null, user);
        } catch(error) {
            return done(error);
        } 
    }));
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.bbc9d7a5cb390a26',
        clientSecret: '71ed9eef93f1de749c8915385834892b5ce9f8b2',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await usersRepository.getByEmail({email: profile._json.email});
            if (!user) {
                const cart = await cartService.addCart();
                let newUser = {
                    firstName: profile._json.name,
                    lastName: '',
                    age: 18,
                    email: profile._json.email,
                    password: '',
                    cart: cart._id
                }
                let result = await usersRepository.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch(error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        let user = await usersRepository.getById(id);
        done(null, user);
    })
};

export default initializePassport;